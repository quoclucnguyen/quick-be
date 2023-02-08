import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsAlphanumeric, IsNotEmpty, IsNumberString, IsPhoneNumber, IsString, MaxLength, MinLength } from "class-validator";

export class CreateCustomerDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @IsNumberString()
    @IsPhoneNumber('VN')
    @Transform((value: any) => value.trim(), { toPlainOnly: true })
    phone: string;

    @ApiProperty()
    @IsNotEmpty()
    @Transform((value: any) => value.trim(), { toPlainOnly: true })
    name: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsAlphanumeric()
    @MinLength(4)
    @MaxLength(4)
    @Transform((value: any) => value.trim(), { toPlainOnly: true })
    otp: string;

    @ApiProperty({ description: 'File chụp mã S/N' })
    fileSN: Express.Multer.File;
}
