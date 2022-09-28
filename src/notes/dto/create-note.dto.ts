import { IsString, Length, Validate } from "class-validator";

export class CreateNoteDTO {
    @IsString({ message: "Must be string" })
    @Length(2, 30, { message: "Length must be between 3 and 30" })
    readonly title: string;

    @IsString({ message: "Must be string" })
    @Length(1, 500, { message: "Length must be between 1 and 500" })
    readonly content: string;

    readonly category: string;
}
