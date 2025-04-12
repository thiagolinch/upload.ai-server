"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield prisma.prompt.deleteMany();
        yield prisma.prompt.create({
            data: {
                title: 'Título YouTube',
                template: `Your role is to generate three titles for a YouTube video.

      Below, you will receive a transcript of that video; use this transcript to generate the titles.
      Below, you will also receive a list of titles; use this list as a reference for the titles to be generated.
      
      The titles should have a maximum of 60 characters.
      The titles should be catchy and attractive to maximize clicks.
      
      Return ONLY the three titles in a list format as shown below:
      '''
- Title 1
- Title 2
- Title 3
'''

Transcription:
'''
{transcription}
'''`.trim()
            }
        });
        yield prisma.prompt.create({
            data: {
                title: 'Descrição YouTube',
                template: `Your role is to generate a succinct description for a YouTube video.

      Below, you will receive a transcription of this video; use this transcription to create the description.
      
      The description should be a maximum of 80 words in the first person and contain the video's main points.
      
      Use catchy words that captivate the reader's attention.
      
      Additionally, at the end of the description, include a list of 3 to 10 lowercase hashtags containing keywords from the video.
      
      The response should follow the following format:
'''
Description.

#hashtag1 #hashtag2 #hashtag3 ...
'''

Transcription:
'''
{transcription}
'''`.trim()
            }
        });
    });
}
main()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}))
    .catch((e) => __awaiter(void 0, void 0, void 0, function* () {
    console.error(e);
    yield prisma.$disconnect();
    process.exit(1);
}));
