import { calculateCategoriesCount } from "./../utils/calculateCategoriesCount";
import { CreateNoteDTO } from "./dto/create-note.dto";
import { InjectModel } from "@nestjs/sequelize";
import { createNoteObj } from "src/utils/toolsForNoteObj";
import ActiveNote from "./activeNotes.model";
import ArchiveNote from "./archiveNotes.model";
import { Injectable } from "@nestjs/common";
import { ValidationException } from "src/pipes/validation.exception";

export interface INote {
    id: number;
    title: string;
    slug: string;
    content: string;
    category: string;
    parseddates: string[];
    createdAt: string;
    updatedAt: string;
}

@Injectable()
class NotesService {
    constructor(
        @InjectModel(ActiveNote) private activeNoteRep: typeof ActiveNote,
        @InjectModel(ArchiveNote) private archiveNoteRep: typeof ArchiveNote
    ) {}

    async stats() {
        return calculateCategoriesCount(
            await this.activeNoteRep.findAll(),
            await this.archiveNoteRep.findAll()
        );
    }

    async createNote(dto: CreateNoteDTO) {
        const { title } = dto;

        const validate = await this.slugExists(title, "create");
        if (validate) {
            throw new ValidationException(title + " already exists");
        } else {
            return await this.activeNoteRep.create(createNoteObj(dto));
        }
    }

    async getAllActive() {
        return await this.activeNoteRep.findAll({
            order: [["id", "ASC"]],
        });
    }

    async getAllArchive() {
        return await this.archiveNoteRep.findAll({ order: [["id", "ASC"]] });
    }

    async getNoteBySlug(slug: string) {
        const note = await this.activeNoteRep.findOne({ where: { slug } });
        return note;
    }

    async deleteById(id: number) {
        const findInActive = await this.activeNoteRep.findOne({
            where: { id: id },
        });
        if (findInActive) {
            return await this.activeNoteRep.destroy({ where: { id: id } });
        } else {
            return await this.archiveNoteRep.destroy({ where: { id: id } });
        }
    }

    async updateNote(id: number, dto: CreateNoteDTO) {
        const { title } = dto;
        const validate = await this.slugExists(title, "update");
        if (validate) {
            throw new ValidationException(title + " already exists");
        } else {
            const note = await this.activeNoteRep.update(
                { ...createNoteObj(dto) },
                {
                    where: { id: id },
                    returning: true,
                }
            );

            return note[1][0];
        }
    }

    async archiveUnArchive(id: number) {
        const findInActive = await this.activeNoteRep.findOne({
            where: { id: id },
        });

        if (findInActive) {
            return this.moveNote(findInActive, "archive");
        } else {
            const findInArchive = await this.archiveNoteRep.findOne({
                where: { id: id },
            });
            if (findInArchive) {
                return this.moveNote(findInArchive, "unarchive");
            }
        }
    }

    async slugExists(title: string, type: "create" | "update") {
        const prettifyTitle = title
            .replace(/[^\w ]/g, "")
            .split(" ")
            .filter((i) => i)
            .join(" ");
        const slug = prettifyTitle.toLowerCase().split(" ").join("-");

        const allSlugs = await Promise.all([
            this.activeNoteRep.findAll({ attributes: ["slug"] }),
            this.archiveNoteRep.findAll({ attributes: ["slug"] }),
        ]);
        const slugs = [...allSlugs[0], ...allSlugs[1]];

        if (slugs.length) {
            const findSlug =
                type === "create"
                    ? slugs.find((i) => i.slug === slug)
                    : slugs
                          .filter((i) => i.slug !== slug)
                          .find((i) => i.slug === slug);
            if (findSlug) {
                return "already exists";
            } else {
                return null;
            }
        }
    }

    async moveNote(note: ActiveNote, type: "archive" | "unarchive") {
        const {
            id,
            title,
            content,
            category,
            parseddates,
            slug,
            createdAt,
            updatedAt,
        } = note;

        const newNote =
            type === "archive"
                ? await this.archiveNoteRep.create()
                : await this.activeNoteRep.create();

        const updateMe =
            type === "archive" ? this.archiveNoteRep : this.activeNoteRep;
        const destroyMe =
            type === "archive" ? this.activeNoteRep : this.archiveNoteRep;

        await destroyMe.destroy({ where: { id: id } });

        const returningNote = await updateMe.update(
            {
                id,
                title,
                content,
                category,
                parseddates,
                slug,
                createdAt,
                updatedAt,
            },
            {
                where: { id: newNote.id },
                returning: true,
            }
        );

        return returningNote[1][0];
    }
}

export default NotesService;
