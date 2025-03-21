import { ApiProperty } from "@nestjs/swagger";
import { z } from "zod";
import { createZodDto } from "nestjs-zod";
export class CreateAccountDto {
    @ApiProperty({ example: 'Cash' })
    name: string

    @ApiProperty({ example: 2000 })
    balance: bigint
}

export class GetAccountDto {
    @ApiProperty({ example: 1 })
    id: number

    @ApiProperty({ example: 'string' })
    name: string

    @ApiProperty({ example: 'number' })
    balance: number
    
    constructor(account: any){
        this.id = account.id;
        this.name = account.name;
        this.balance = Number(account.balance);
    }
}

const updateBalanceZod = z.object({
    user: z.number(),
    account: z.number(),
    balance: z.number().min(1),
})

export class UpdateBalanceZod extends createZodDto(updateBalanceZod) {}

export class getBalanceDTO {
    @ApiProperty({example: 200})
    amount: number
}

export class getYearlyReportDTO {
    @ApiProperty({example: 500})
    total_income: number
    @ApiProperty({example: 300})
    total_expense: number
    @ApiProperty({example: 200})
    total_remaining: number
}