// Data transformation utility functions
export const transformHeaderData = (headerData = {}) => ({
  Name: headerData?.Name || headerData?.name || "",
  Email: headerData?.Email || headerData?.email || "",
  Phone: headerData?.Phone || headerData?.phone || "",
  GitHub: headerData?.GitHub || headerData?.github || "", // This becomes "GitHub"
  LinkedIn: headerData?.LinkedIn || headerData?.linkedin || "", // This becomes "LinkedIn"
});

export const transformWorkExperience = (workExp = []) => {
  if (!Array.isArray(workExp)) return [];

  return workExp.map((exp) => ({
    position: exp?.Position || exp?.position || "",
    company: exp?.Company || exp?.company_name || "",
    duration: exp?.Duration || exp?.duration || "",
    responsibilities: Array.isArray(exp?.Responsibilities)
      ? exp.Responsibilities
      : Array.isArray(exp?.responsibilities)
      ? exp.responsibilities
      : typeof exp?.Responsibilities === "string"
      ? [exp.Responsibilities]
      : typeof exp?.responsibilities === "string"
      ? [exp.responsibilities]
      : [],
  }));
};

export const transformEducation = (edu = {}) => ({
  degree: edu?.Degree || edu?.degree || "",
  specialization: edu?.Specialization || edu?.specialization || "",
  institution: edu?.Institution || edu?.institution || "",
  graduationYear: edu?.["Graduation Year"] || edu?.graduation_year || "",
});

export const transformProjects = (projects = []) => {
  if (!Array.isArray(projects)) return [];

  return projects.map((proj) => ({
    name: proj?.["Project Name"] || proj?.name || "",
    description: proj?.Description || proj?.description || "",
    technologies: Array.isArray(proj?.Technologies)
      ? proj.Technologies
      : typeof proj?.skills_used === "string"
      ? [proj.skills_used]
      : [],
    duration: proj?.Duration || "",
    role: proj?.Role || "",
  }));
};

export const transformResumeData = (apiResponse) => {
  if (!apiResponse?.resume) {
    throw new Error("Invalid API response structure: missing resume data");
  }

  const { resume } = apiResponse;

  try {
    return {
      header: transformHeaderData(resume.Header || resume.header),
      summary:
        resume.Summary?.["Professional Summary"] ||
        resume.Summary ||
        resume.summary ||
        "",
      skills: Array.isArray(resume.Skills)
        ? resume.Skills.filter(Boolean)
        : Array.isArray(resume.skills)
        ? resume.skills.filter(Boolean)
        : [],
      workExperience: transformWorkExperience(
        resume["Work Experience"] || resume.work_experience
      ),
      education: [transformEducation(resume.Education || resume.education)],
      academicProjects: transformProjects(
        resume["Academic Projects"] || resume.Academic_projects
      ),
      certifications: Array.isArray(resume.Certifications)
        ? resume.Certifications.filter(Boolean)
        : Array.isArray(resume.certifications)
        ? resume.certifications.filter(Boolean)
        : [],
    };
  } catch (error) {
    console.error("Data transformation error:", error);
    throw new Error(`Failed to transform resume data: ${error.message}`);
  }
};