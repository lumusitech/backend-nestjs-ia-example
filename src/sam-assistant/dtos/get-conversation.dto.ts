import { IsNotEmpty, IsString } from 'class-validator';

export class GetConversationDto {
  @IsString()
  @IsNotEmpty()
  conversationId: string;
}
