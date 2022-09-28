import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { SequelizeModule } from "@nestjs/sequelize";
import ActiveNote from "./notes/activeNotes.model";
import ArchiveNote from "./notes/archiveNotes.model";
import { NotesModule } from "./notes/notes.module";

@Module({
    controllers: [],
    providers: [],
    imports: [
        ConfigModule.forRoot({
            envFilePath: ".env",
        }),
        SequelizeModule.forRoot({
            dialect: "postgres",
            host: process.env.POSTGRES_HOST,
            port: Number(process.env.POSTGRES_PORT),
            username: process.env.POSTGRES_NAME,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DB,
            models: [ActiveNote, ArchiveNote],
            autoLoadModels: true,
            dialectOptions: {
                ssl: true,
                native: true,
            },
        }),
        NotesModule,
    ],
})
export class AppModule {}
