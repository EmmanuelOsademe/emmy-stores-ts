import { TypeOf } from "zod";
import { createSessionSchema} from "@/resources/session/session.validation";

export type CreateSessionInterface = TypeOf<typeof createSessionSchema>['body'];