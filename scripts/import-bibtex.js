
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bibtexParse from 'bibtex-parse-js';
import slugify from 'slugify';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BIB_FILE = path.join(process.cwd(), 'citations.bib');
const OUTPUT_DIR = path.join(process.cwd(), 'src', 'content', 'publications');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Helper to clean BibTeX strings (remove braces)
function cleanString(str) {
  if (!str) return '';
  return str.replace(/[{}]/g, '').trim();
}

// Helper to parse authors
function parseAuthors(authorStr) {
  if (!authorStr) return [];
  return authorStr.split(' and ').map(name => {
    const cleanName = cleanString(name);
    // Handle "Last, First" format
    if (cleanName.includes(',')) {
      const parts = cleanName.split(',').map(p => p.trim());
      return `${parts[1]} ${parts[0]}`;
    }
    return cleanName;
  });
}

// Main function
function importBibtex() {
  if (!fs.existsSync(BIB_FILE)) {
    console.error(`Error: BibTeX file not found at ${BIB_FILE}`);
    console.log('Please place your "citations.bib" file in the project root.');
    process.exit(1);
  }

  const bibContent = fs.readFileSync(BIB_FILE, 'utf-8');
  const parsed = bibtexParse.toJSON(bibContent);

  console.log(`Found ${parsed.length} entries. Processing...`);

  let count = 0;
  parsed.forEach(entry => {
    const tags = entry.entryTags;
    
    // Basic validation
    if (!tags.title || !tags.year) {
      console.warn(`Skipping entry ${entry.citationKey}: Missing title or year.`);
      return;
    }

    const title = cleanString(tags.title);
    const year = parseInt(tags.year, 10);
    const authors = parseAuthors(tags.author);
    const venue = cleanString(tags.booktitle || tags.journal || tags.school || 'Unknown Venue');
    const type = entry.entryType === 'book' ? 'book' : 'paper';
    const description = cleanString(tags.abstract || `Published in ${venue}.`);
    
    // Extract additional fields
    // Cover image: check 'cover', 'image', 'figure'
    let cover = cleanString(tags.cover || tags.image || tags.figure || '');
    const DEFAULT_COVER = '../../assets/paper-vision.jpg';

    // Validate cover image existence
    if (cover) {
      // Resolve path relative to src/content/publications
      // ../../assets/xxx.jpg -> src/assets/xxx.jpg
      const relativeToRoot = cover.replace('../../', 'src/');
      const absolutePath = path.join(process.cwd(), relativeToRoot);
      
      if (!fs.existsSync(absolutePath)) {
        console.warn(`Warning: Cover image not found at ${absolutePath}. Using default.`);
        cover = DEFAULT_COVER;
      }
    } else {
      cover = DEFAULT_COVER;
    }
    
    // PDF link: check 'pdf', 'file', 'url'
    // Note: 'file' often comes from Zotero/JabRef in format ":/path/to/file.pdf:PDF"
    let pdf = cleanString(tags.pdf || tags.file || tags.url || '');
    if (pdf.startsWith(':')) {
      // Cleanup Zotero file format if needed, or just leave as is if it's a valid path
      // Simple heuristic: if it looks like ":path:type", take the middle
      const parts = pdf.split(':');
      if (parts.length >= 2 && parts[1].trim() !== '') {
        pdf = parts[1];
      }
    }
    
    // Code link: check 'code', 'code_url', 'github', 'repository'
    const code = cleanString(tags.code || tags.code_url || tags.github || tags.repository || '#');
    const website = cleanString(tags.website || tags.webpage || tags.project || '');
    const slides = cleanString(tags.slides || tags.presentation || tags.ppt || '');
    const video = cleanString(tags.video || tags.recording || '');
    const demo = cleanString(tags.demo || '');

    // Badges parsing
    const badges = [];
    const award = cleanString(tags.award || tags.honor || '');
    if (award) {
      badges.push({ text: award, type: 'gold' });
    }
    
    // Check for keywords in note or keywords field
    const note = cleanString(tags.note || tags.keywords || '');
    if (note.toLowerCase().includes('best paper') && !award.toLowerCase().includes('best paper')) {
       badges.push({ text: 'Best Paper', type: 'gold' });
    }
    if (note.toLowerCase().includes('oral')) {
       badges.push({ text: 'Oral', type: 'blue' });
    }
    if (note.toLowerCase().includes('spotlight')) {
       badges.push({ text: 'Spotlight', type: 'red' });
    }
    if (note.toLowerCase().includes('best student paper')) {
      badges.push({ text: 'Best Student Paper', type: 'gold' });
    }

    // Generate filename: year-firstAuthor-titleSlug
    const firstAuthor = authors.length > 0 ? authors[0].split(' ').pop() : 'unknown';
    const titleSlug = slugify(title, { lower: true, strict: true }).slice(0, 30);
    const filename = `${year}-${firstAuthor}-${titleSlug}.md`;
    const filePath = path.join(OUTPUT_DIR, filename);

    // Check if file already exists to avoid overwriting manual edits (optional policy)
    // For now, we overwrite or create new.
    
    const frontmatter = [
      '---',
      `title: "${title.replace(/"/g, '\\"')}"`,
      `authors: [${authors.map(a => `"${a}"`).join(', ')}]`,
      `year: ${year}`,
      `venue: "${venue.replace(/"/g, '\\"')}"`,
      `type: "${type}"`,
      `cover: "${cover}"`,
      'links:',
      `  pdf: "${pdf || '#'}"`,
      `  code: "${code}"`,
      `  website: "${website}"`,
      `  demo: "${demo}"`,
      `  slides: "${slides}"`,
      `  video: "${video}"`,
      badges.length > 0 ? 'badges:' : '',
      ...badges.map(b => `  - { text: "${b.text}", type: "${b.type}" }`),
      `description: "${description.replace(/"/g, '\\"')}"`,
      'featured: false',
      '---',
      '',
      description
    ].filter(line => line !== '').join('\n');

    fs.writeFileSync(filePath, frontmatter);
    console.log(`Generated: ${filename}`);
    count++;
  });

  console.log(`\nSuccessfully imported ${count} publications.`);
}

importBibtex();
