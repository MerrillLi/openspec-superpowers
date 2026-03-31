/**
 * oh-my-research — OpenSpec OPSX + Superpowers-adapted skills for OpenCode.
 *
 * npm 入口：与 `package.json` 的 `main` 对齐；`skills/` 与本文件同处包根目录。
 * 本地 `.opencode/plugins/` 下的文件仅 re-export 本模块，便于 file:// 与目录插件两种装法。
 */

import fs from 'fs';
import { fileURLToPath } from 'url';

import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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

const OhMyResearchPlugin = async () => {
  const pluginSkillsDir = path.resolve(__dirname, 'skills');

  const getBootstrapContent = () => {
    const skillPath = path.join(pluginSkillsDir, 'using-oh-my-research', 'SKILL.md');
    if (!fs.existsSync(skillPath)) return null;

    const fullContent = fs.readFileSync(skillPath, 'utf8');
    const { content } = extractAndStripFrontmatter(fullContent);

    const toolMapping = `**Tool mapping (OpenCode):**
- \`TodoWrite\` → \`todowrite\`
- Subagents → OpenCode @mention / Task-style dispatch when available
- \`Skill\` → native \`skill\` tool
- File and shell tools → your native equivalents

**Skills path (this plugin):** \`${pluginSkillsDir}\`
Use \`openspec\` CLI in the target repo where \`openspec init\` was run. OPSX commands are \`/opsx:*\` in chat.`;

    return `<EXTREMELY_IMPORTANT>
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

    'experimental.chat.system.transform': async (_input, output) => {
      const bootstrap = getBootstrapContent();
      if (bootstrap) {
        (output.system ||= []).push(bootstrap);
      }
    },
  };
};

export { OhMyResearchPlugin };
export default OhMyResearchPlugin;
