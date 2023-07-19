import {ApiProperty} from "@nestjs/swagger";
import {IsNumber, IsOptional} from "class-validator";
import {getSkipCount} from "../../../../libs/shared/helpers";

export class MyPostQuery {
    constructor() {
        Object.defineProperty(this, 'skip', {
            get() {
                return getSkipCount(this.page);
            },
            set(_val: string) {
                throw Error(`Property "skip" are only getter. Don't set value ${_val}`);
            },
        });
    }

    @ApiProperty({ default: 0, required: false })
    @IsOptional()
    @IsNumber()
    page: number

    /**
     * Property "skip" are only getter. Don\'t set value
     */
    skip = 0;
}