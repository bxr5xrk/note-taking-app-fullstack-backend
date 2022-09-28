import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
} from "@nestjs/common";
import { CreateNoteDTO } from "./dto/create-note.dto";
import NotesService from "./notes.service";

@Controller("api/notes")
export class NotesController {
    constructor(private notesService: NotesService) {}

    @Post()
    create(@Body() noteDto: CreateNoteDTO) {
        return this.notesService.createNote(noteDto);
    }

    @Get()
    getAllActive() {
        return this.notesService.getAllActive();
    }

    @Get("/archive")
    getAllArchive() {
        return this.notesService.getAllArchive();
    }

    @Get("/stats")
    getStats() {
        return this.notesService.stats();
    }

    @Get(":slug")
    getOne(@Param("slug") slug: string) {
        return this.notesService.getNoteBySlug(slug);
    }

    @Delete(":id")
    delete(@Param("id") id: string) {
        return this.notesService.deleteById(+id);
    }

    @Patch(":id")
    update(@Param("id") id: string, @Body() updateNoteDto: CreateNoteDTO) {
        return this.notesService.updateNote(+id, updateNoteDto);
    }

    @Patch("/archive/:id")
    archiveOrUnarchive(@Param("id") id: string) {
        return this.notesService.archiveUnArchive(+id);
    }
}
