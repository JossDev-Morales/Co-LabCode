import { UUID } from "crypto";
import { v4 } from "uuid";

export default function getUUID() {
    return v4() as UUID
}