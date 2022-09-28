import { ValidationException } from "./validation.exception";
import { PipeTransform, Injectable, ArgumentMetadata } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";

@Injectable()
export class ValidationPipe implements PipeTransform {
    private toValidate(metatype: Function): boolean {
        const types: Function[] = [String, Boolean, Number, Array, Object];
        return !types.includes(metatype);
    }

    async transform(value: any, { metatype }: ArgumentMetadata) {
        if (!metatype || !this.toValidate(metatype)) {
            return value;
        }

        const object = plainToInstance(metatype, value);
        const errors = await validate(object);
        if (errors.length > 0) {
            let messages = errors.map(
                (e) =>
                    `${e.property} - ${Object.values(e.constraints).join(", ")}`
            );

            throw new ValidationException(messages);
        }
        return value;
    }
}
