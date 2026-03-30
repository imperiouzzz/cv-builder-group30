const fs = require("fs");
const path = require("path");
const { transformSync } = require("@babel/core");
const presetReact = require("@babel/preset-react");
const presetTypeScript = require("@babel/preset-typescript");

const filesToConvert = [
  "frontend/app/auth/login/page.tsx",
  "frontend/app/auth/register/page.tsx",
  "frontend/app/builder/[id]/page.tsx",
  "frontend/app/dashboard/page.tsx",
  "frontend/app/layout.tsx",
  "frontend/app/page.tsx",
  "frontend/components/builder/FinishScreen.tsx",
  "frontend/components/builder/FormPanel.tsx",
  "frontend/components/builder/FormPrimitives.tsx",
  "frontend/components/builder/modals/JobMatchModal.tsx",
  "frontend/components/builder/modals/OrderModal.tsx",
  "frontend/components/builder/modals/PasteModal.tsx",
  "frontend/components/builder/modals/UploadModal.tsx",
  "frontend/components/builder/steps/CustomStep.tsx",
  "frontend/components/builder/steps/EducationStep.tsx",
  "frontend/components/builder/steps/PersonalStep.tsx",
  "frontend/components/builder/steps/ProfileStep.tsx",
  "frontend/components/builder/steps/ProjectsStep.tsx",
  "frontend/components/builder/steps/ReferencesStep.tsx",
  "frontend/components/builder/steps/SkillsStep.tsx",
  "frontend/components/builder/steps/VolunteeringStep.tsx",
  "frontend/components/builder/steps/WorkStep.tsx",
  "frontend/components/layout/Sidebar.tsx",
  "frontend/components/preview/PreviewPanel.tsx",
  "frontend/hooks/useAtsScore.ts",
  "frontend/hooks/useAutoSave.ts",
  "frontend/lib/api.ts",
  "frontend/lib/cvParser.ts",
  "frontend/lib/pdfFallback.ts",
  "frontend/store/cvStore.ts",
  "frontend/types/cv.types.ts",
];

function convertTypeScriptToJavaScript(filePath) {
  const absolutePath = path.resolve(filePath);
  const code = fs.readFileSync(absolutePath, "utf-8");

  const result = transformSync(code, {
    presets: [
      presetTypeScript,
      [presetReact, { runtime: "automatic" }],
    ],
    filename: filePath,
  });

  // Determine new filename
  const newFilePath = filePath
    .replace(/\.tsx$/, ".jsx")
    .replace(/\.ts$/, ".js");
  const newAbsolutePath = path.resolve(newFilePath);

  // Write converted file
  fs.writeFileSync(newAbsolutePath, result.code, "utf-8");
  console.log(`✓ Converted: ${filePath} → ${newFilePath}`);

  // Remove original file
  fs.unlinkSync(absolutePath);
}

// Process all files
filesToConvert.forEach((file) => {
  try {
    convertTypeScriptToJavaScript(file);
  } catch (err) {
    console.error(`✗ Error converting ${file}:`, err.message);
  }
});

console.log("\nConversion complete!");
