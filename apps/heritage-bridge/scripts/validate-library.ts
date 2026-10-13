import { validateLibrary, publishedWorks, libraryVersion } from '../shared/library';
const errors = validateLibrary();
if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else
  console.log(
    `Library ${libraryVersion}: ${publishedWorks.length} reviewed entries across three collections; validation passed.`,
  );
