import { SequelizeModule } from "@nestjs/sequelize";
import { Module } from "@nestjs/common";
import { NotesController } from "./notes.controller";
import NotesService from "./notes.service";
import ActiveNote from "./activeNotes.model";
import ArchiveNote from "./archiveNotes.model";

@Module({
    controllers: [NotesController],
    providers: [NotesService],
    imports: [SequelizeModule.forFeature([ActiveNote, ArchiveNote])],
})
export class NotesModule {}
