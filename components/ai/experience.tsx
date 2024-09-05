"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { experienceLevels, experienceLevelIcons } from "../jobs/data";

export type Experience = (typeof experienceLevels)[number];

export function ExperienceSelect(props: {
    experienceLevel: Experience;
    setExperienceLevel: Dispatch<SetStateAction<Experience>>;
}) {
    return (
        <>
            <Label htmlFor="experience">Experience</Label>
            <input type="text" hidden aria-hidden name="experience" onChange={() => {}} value={props.experienceLevel} />
            <Select
                onValueChange={(val) => {
                    props.setExperienceLevel(val as Experience);
                }}
            >
                <SelectTrigger id="experience" name="experience" className="items-start [&_[data-description]]:hidden">
                    <SelectValue placeholder="Choose experience level" />
                </SelectTrigger>
                <SelectContent>
                    {experienceLevels.map((level, idx: number) => (
                        <SelectItem value={level} key={idx}>
                            <div className="flex items-start gap-3 text-muted-foreground">
                                {experienceLevelIcons[level]}
                                <div className="flex items-center justify-center">
                                    <p>{level}</p>
                                </div>
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </>
    );
}
