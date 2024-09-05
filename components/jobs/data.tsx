import { Handshake, GlobeLock, ReceiptText, HardHat, Footprints, Waypoints } from "lucide-react";

export const employmentTypes = ["Contract", "Permanent", "Part/time"] as const;
export const employmentTypeIcons: Record<(typeof employmentTypes)[number], JSX.Element> = {
    Contract: <Handshake />,
    Permanent: <GlobeLock />,
    "Part/time": <ReceiptText />,
};

export const experienceLevels = ["Entry Level", "Mid/Intermediate Level", "Expert"] as const;
export const experienceLevelIcons: Record<(typeof experienceLevels)[number], JSX.Element> = {
    Expert: <HardHat />,
    "Entry Level": <Footprints />,
    "Mid/Intermediate Level": <Waypoints />,
};
