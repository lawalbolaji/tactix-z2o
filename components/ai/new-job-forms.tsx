"use client";

import { useState } from "react";
import { createNewJobPosting } from "../../app/dashboard/jobs/new/action";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Employment, EmploymentTypeSelect } from "./employment-type";
import { Experience, ExperienceSelect } from "./experience";
import { Editor } from "./rooteditor/editor";
import { SubmitButton } from "./submitbtn";
import { DatePickerDemo } from "./choose-date";
import { applicationReceivedResponse } from "../../lib/constants";

export function NewJobForm() {
    const [title, setTitle] = useState("");
    const [experienceLevel, setExperienceLevel] = useState<Experience>("Entry Level");
    const [employmentType, setEmploymentType] = useState<Employment>("Permanent");
    const [salary, setSalary] = useState("");
    const [qualifications, setQualifications] = useState("");
    const [location, setLocation] = useState("");
    const [date, setDate] = useState<Date>();

    return (
        <form action={createNewJobPosting}>
            <header className="sticky top-0 z-10 flex h-[57px] items-center gap-1 bg-background px-4">
                <h1 className="text-xl font-semibold pl-[1%] pt-[2%]">Create a new job</h1>
                <SubmitButton />
            </header>
            <main className="grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-3 md:border md:rounded-md md:shadow-md md:mx-[2%] md:mt-[1%]">
                <div
                    className="relative hidden flex-col items-start gap-8 md:flex h-[80vh] overflow-auto hide-scrollbar"
                    x-chunk="dashboard-03-chunk-0"
                >
                    <div className="grid w-full items-start gap-6">
                        <fieldset className="grid gap-6 rounded-lg border p-4">
                            <legend className="-ml-1 px-1 text-sm font-medium">Settings</legend>
                            <div className="grid gap-3">
                                <Label htmlFor="title">Job title</Label>
                                <Input
                                    id="title"
                                    type="text"
                                    name="title"
                                    value={title}
                                    onChange={(e) => {
                                        setTitle(e.currentTarget.value);
                                    }}
                                    required
                                    aria-required
                                    placeholder="Senior software engineer"
                                />
                            </div>
                            <div className="grid gap-3">
                                <ExperienceSelect
                                    experienceLevel={experienceLevel}
                                    setExperienceLevel={setExperienceLevel}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-3 text-left">
                                    <EmploymentTypeSelect
                                        employmentType={employmentType}
                                        setEmploymentType={setEmploymentType}
                                    />
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="salary">Salary</Label>
                                    <Input
                                        id="salary"
                                        name="salary"
                                        value={salary}
                                        onChange={(e) => {
                                            setSalary(e.currentTarget.value);
                                        }}
                                        required
                                        aria-required
                                        type="text"
                                        placeholder="₦ 20,000,000"
                                    />
                                </div>
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="qualifications">Min. Qualifications</Label>
                                <Input
                                    id="qualifications"
                                    type="text"
                                    name="qualifications"
                                    value={qualifications}
                                    onChange={(e) => {
                                        setQualifications(e.currentTarget.value);
                                    }}
                                    required
                                    aria-required
                                    placeholder="BSc. Technology"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {/* TODO: swap with autocomplete from google */}
                                <div className="grid gap-3">
                                    <Label htmlFor="location">Location</Label>
                                    <Input
                                        id="location"
                                        name="location"
                                        value={location}
                                        onChange={(e) => {
                                            setLocation(e.currentTarget.value);
                                        }}
                                        required
                                        aria-required
                                        type="text"
                                        placeholder="Lagos, Nigeria"
                                    />
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="expires_at">Job expiry date</Label>
                                    <input
                                        type="text"
                                        name="expires_at"
                                        id="expires_at"
                                        value={date?.toISOString() ?? ""}
                                        onChange={() => {}}
                                        hidden
                                        aria-hidden
                                    />
                                    <DatePickerDemo {...{ date, setDate }} />
                                </div>
                            </div>
                        </fieldset>
                        <fieldset className="grid gap-6 rounded-lg border p-4">
                            <legend className="-ml-1 px-1 text-sm font-medium">Confirmation Message</legend>
                            <div className="grid gap-3">
                                <Label htmlFor="email-subject">Subject</Label>
                                <Input
                                    id="email_subject"
                                    type="text"
                                    name="email_subject"
                                    required
                                    aria-required
                                    placeholder="Thank you for applying at {{user.company}}"
                                    defaultValue="Thank you for applying at {{user.company}}"
                                />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="email-message">Message</Label>
                                <Textarea
                                    id="email_message"
                                    name="email_message"
                                    required
                                    aria-required
                                    placeholder="Dear {{application.name}}"
                                    className="min-h-[9.5rem]"
                                    defaultValue={applicationReceivedResponse}
                                />
                            </div>
                        </fieldset>
                    </div>
                </div>
                <Editor {...{ title, employmentType, experienceLevel, salary, location, qualifications }} />
            </main>
        </form>
    );
}
