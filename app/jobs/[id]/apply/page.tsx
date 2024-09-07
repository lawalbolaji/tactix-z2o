import { notFound, redirect } from "next/navigation";
import { z } from "zod";
import { SubmitButton } from "@/components/apply/submitbtn";
import { FileUploader } from "@/components/apply/fileuploader";

export default function ApplyForJob({ params }: { params: { id: string } }) {
  const { success, data: jobId, error: urlValidationError } = z.string().safeParse(params.id);
  if (!success) {
    console.log(urlValidationError);
    notFound();
  }

  async function submitJobApplication(formData: FormData) {
    "use server";

    const jobApplicationSchema = z.object({
      name: z.string(),
      email: z.string().email(),
      cover_letter: z.string(),
      additional_info: z.string(),
      linkedin: z.string().url(),
      portfolio: z.string().url(),
      location: z.string(),
      resume_uri: z.string().min(1),
    });

    const {
      success,
      data: application,
      error: validateError,
    } = jobApplicationSchema.safeParse({
      name: formData.get("firstname") + " " + formData.get("lastname"),
      email: formData.get("email"),
      cover_letter: formData.get("cover_letter"),
      additional_info: formData.get("additional_info"),
      linkedin: formData.get("linkedin"),
      portfolio: formData.get("portfolio"),
      location: formData.get("location"),
      resume_uri: formData.get("resume"),
    });

    if (!success) {
      console.log(validateError.flatten().fieldErrors);
      return { error: { message: validateError.flatten().fieldErrors } };
    }

    /* image must have been uploaded otherwise we won't get the resume_uri and the form won't submit */

    const supabase = {} as any;
    const { error: dbError } = await supabase.from("applications").insert([{ ...application, job_id: jobId }]);

    if (dbError) {
      console.log(dbError);
      return { error: { message: "unable to create application" } };
    }

    redirect(`/v2/jobs/${jobId}/success`);
  }

  return (
    <form className="md:w-[50%] w-full" action={submitJobApplication}>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="linkedin" className="block text-sm font-medium leading-6 text-gray-900">
                Linkedin profile
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="linkedin"
                  id="linkedin"
                  autoComplete="linkedin"
                  required
                  aria-required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="portfolio" className="block text-sm font-medium leading-6 text-gray-900">
                Portfolio Url
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="portfolio"
                  id="portfolio"
                  autoComplete="portfolio"
                  required
                  aria-required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="col-span-full">
              <label htmlFor="cover_letter" className="block text-sm font-medium leading-6 text-gray-900">
                Why do you want to join this company
              </label>
              <div className="mt-2">
                <textarea
                  id="cover_letter"
                  name="cover_letter"
                  rows={3}
                  placeholder="tell us a bit about your background and motivation"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                ></textarea>
              </div>
            </div>

            <div className="col-span-full">
              <FileUploader />
            </div>
          </div>
        </div>

        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">Personal Information</h2>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="firstname" className="block text-sm font-medium leading-6 text-gray-900">
                First name
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="firstname"
                  id="firstname"
                  autoComplete="given-name"
                  required
                  aria-required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900">
                Last name
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="lastname"
                  id="lastname"
                  autoComplete="family-name"
                  required
                  aria-required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-full">
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  aria-required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="location" className="block text-sm font-medium leading-6 text-gray-900">
                Location
              </label>
              <div className="mt-2">
                <select
                  id="location"
                  name="location"
                  autoComplete="location"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                >
                  <option>United States</option>
                  <option>Canada</option>
                  <option>Mexico</option>
                </select>
              </div>
            </div>

            <div className="col-span-3">
              <label htmlFor="salary" className="block text-sm font-medium leading-6 text-gray-900">
                Salary expectations
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="salary"
                  id="salary"
                  autoComplete="salary"
                  required
                  aria-required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="col-span-full">
              <label htmlFor="additional_info" className="block text-sm font-medium leading-6 text-gray-900">
                Additional information
              </label>
              <div className="mt-2">
                <textarea
                  id="additional_info"
                  name="additional_info"
                  rows={3}
                  placeholder="Provide any additional bits of information that might help us learn better about you"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                ></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SubmitButton />
    </form>
  );
}
