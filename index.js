/**
 * openspec-superpowers — OpenSpec OPSX + Superpowers-adapted skills for OpenCode.
 *
 * npm 入口：与 `package.json` 的 `main` 对齐；`skills/` 与本文件同处包根目录。
 * 本地 `.opencode/plugins/` 下的文件仅 re-export 本模块，便于 file:// 与目录插件两种装法。
 */

import fs from 'fs';
import { fileURLToPath } from 'url';

import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BOOTSTRAP_MARKER = '<EXTREMELY_IMPORTANT>';

const extractAndStripFrontmatter = (content) => {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { frontmatter: {}, content };

  const frontmatterStr = match[1];
  const body = match[2];
  const frontmatter = {};

  for (const line of frontmatterStr.split('\n')) {
    const colonIdx = line.indexOf(':');
    if (colonIdx > 0) {
      const key = line.slice(0, colonIdx).trim();
      const value = line.slice(colonIdx + 1).trim().replace(/^["']|["']$/g, '');
      frontmatter[key] = value;
    }
  }

  return { frontmatter, content: body };
};

const OpenSpecSuperpowersPlugin = async () => {
  const pluginSkillsDir = path.resolve(__dirname, 'skills');

  const getBootstrapContent = () => {
    const skillPath = path.join(pluginSkillsDir, 'using-openspec-superpowers', 'SKILL.md');
    if (!fs.existsSync(skillPath)) return null;

    const fullContent = fs.readFileSync(skillPath, 'utf8');
    const { content } = extractAndStripFrontmatter(fullContent);

    const toolMapping = `**Tool mapping (OpenCode):**
- \`TodoWrite\` → \`todowrite\`
- Subagents → OpenCode @mention / Task-style dispatch when available
- \`Skill\` → native \`skill\` tool
- File and shell tools → your native equivalents

Use OpenCode's native \`skill\` tool to list and load other relevant skills.`;

    return `${BOOTSTRAP_MARKER}
You have lightweight engineering superpowers.

**IMPORTANT: The using-openspec-superpowers skill content is included below. It is ALREADY LOADED - you are currently following it. Do NOT use the skill tool to load "using-openspec-superpowers" again - that would be redundant.**

${content}

${toolMapping}
</EXTREMELY_IMPORTANT>`;
  };

  return {
    config: async (config) => {
      config.skills = config.skills || {};
      config.skills.paths = config.skills.paths || [];
      if (!config.skills.paths.includes(pluginSkillsDir)) {
        config.skills.paths.push(pluginSkillsDir);
      }
    },

    'experimental.chat.messages.transform': async (_input, output) => {
      const bootstrap = getBootstrapContent();
      if (!bootstrap || !output.messages?.length) return;

      const firstUser = output.messages.find((message) => message.info?.role === 'user');
      if (!firstUser || !firstUser.parts?.length) return;
      if (firstUser.parts.some((part) => part.type === 'text' && part.text.includes(BOOTSTRAP_MARKER))) {
        return;
      }

      const ref = firstUser.parts[0];
      firstUser.parts.unshift({ ...ref, type: 'text', text: bootstrap });
    },
  };
};

export { OpenSpecSuperpowersPlugin };
export default OpenSpecSuperpowersPlugin;
