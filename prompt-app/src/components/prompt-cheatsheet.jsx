import { useState } from "react";

const data = [
  {
    category: "🎯 Role & Persona Commands",
    color: "#FF6B35",
    commands: [
      {
        cmd: "Act as [role]",
        syntax: `Act as a senior DevOps engineer with 10 years of experience in Kubernetes.`,
        when: "When you need expert-level, domain-specific answers.",
        where: "Start of your prompt (sets context for entire conversation).",
        how: "Be specific about the role, years of experience, and niche focus area.",
        output: "You get answers with professional depth, terminology, and real-world nuance instead of generic responses.",
        tip: "Add constraints: 'Act as a Python expert who prefers clean, typed code with no external dependencies.'"
      },
      {
        cmd: "You are [persona] who [trait]",
        syntax: `You are a technical writer who explains complex APIs to non-technical stakeholders.`,
        when: "When tone and communication style matters as much as accuracy.",
        where: "System prompt or top of your message.",
        how: "Define WHO + HOW they communicate + FOR WHOM.",
        output: "Responses match the persona's voice, vocabulary, and audience awareness.",
        tip: "Stack traits: 'You are a skeptical data scientist who questions assumptions and asks for sources.'"
      }
    ]
  },
  {
    category: "📋 Format & Structure Commands",
    color: "#4ECDC4",
    commands: [
      {
        cmd: "Respond in [format]",
        syntax: `Respond in: 1) a table, 2) bullet points, 3) JSON, 4) markdown with headers.`,
        when: "When you know exactly how you want the output structured.",
        where: "End of your prompt or as a standalone instruction.",
        how: "Name the exact format. For JSON, optionally include a schema.",
        output: "Clean, copy-pasteable output ready for docs, code, spreadsheets, or slides.",
        tip: "Use XML tags: 'Wrap your answer inside <answer> tags and code inside <code> tags.'"
      },
      {
        cmd: "Limit to [N] words/bullets/steps",
        syntax: `Explain Docker in exactly 5 bullet points, each under 15 words.`,
        when: "When you want concise, scannable output — not essays.",
        where: "Add after your main request.",
        how: "Set a hard number. 'Short' is vague. '3 sentences' is precise.",
        output: "Tight, distilled answers that get to the point without fluff.",
        tip: "Combine with format: 'Give me 3 steps, each as: [Step Name]: [One sentence explanation].'"
      },
      {
        cmd: "Use the template: [template]",
        syntax: `Use this template for each item:\n**[Tool Name]**: [What it does] | Best for: [Use case] | Avoid when: [Limitation]`,
        when: "When you need uniform, comparable outputs across multiple items.",
        where: "Provide template inline, ideally with a filled example.",
        how: "Fill in one row yourself as a reference — this anchors the model.",
        output: "Every item follows the same structure, making it easy to scan, compare, and reuse.",
        tip: "Include a dummy example row: 'Here's a filled example: **Git**: Version control | Best for: code | Avoid when: binary files.'"
      }
    ]
  },
  {
    category: "🔗 Chain of Thought Commands",
    color: "#A855F7",
    commands: [
      {
        cmd: "Think step by step",
        syntax: `A user can't log in. Think step by step to diagnose the issue before giving a solution.`,
        when: "For complex reasoning, debugging, math, or multi-stage problems.",
        where: "Before or after your question.",
        how: "Just add the phrase — it activates deliberate reasoning mode.",
        output: "Visible reasoning chain that's easier to verify, correct, and trust.",
        tip: "Pair with: 'Show your reasoning in <thinking> tags, then give the final answer outside them.'"
      },
      {
        cmd: "First [do X], then [do Y]",
        syntax: `First identify all the assumptions in this argument, then evaluate each one critically.`,
        when: "Multi-phase tasks where order of operations matters.",
        where: "As the instruction structure itself.",
        how: "Use numbered phases for 3+ steps: 'First... Then... Finally...'",
        output: "Structured, phased output that doesn't skip steps or conflate tasks.",
        tip: "'First brainstorm 10 ideas without filtering. Then pick the top 3. Then write a pitch for each.'"
      },
      {
        cmd: "Before answering, consider [constraint]",
        syntax: `Before answering, consider that the user is a complete beginner with no coding background.`,
        when: "When the answer should be filtered through a specific lens.",
        where: "Right before your main question.",
        how: "Name the constraint clearly: audience, constraints, edge cases, risks.",
        output: "Answers pre-filtered for relevance to your specific context.",
        tip: "'Before answering, consider: budget < $50, timeline < 1 week, team size = 1 person.'"
      }
    ]
  },
  {
    category: "🎛️ Precision & Scope Commands",
    color: "#F59E0B",
    commands: [
      {
        cmd: "Only [scope]",
        syntax: `Only use vanilla JavaScript. No libraries. No frameworks. No build tools.`,
        when: "To prevent scope creep or unwanted suggestions.",
        where: "As explicit constraint lines in your prompt.",
        how: "Use 'Only' + 'No' together to define both what to include AND exclude.",
        output: "Tightly scoped answers that don't drift into irrelevant territory.",
        tip: "'Only explain the networking layer. Do not explain authentication, storage, or UI.'"
      },
      {
        cmd: "Assume [context]",
        syntax: `Assume I'm running Ubuntu 22.04, Python 3.11, and already have pip installed.`,
        when: "To skip obvious setup steps and get straight to the answer.",
        where: "Early in your prompt as background context.",
        how: "State environment, skill level, and what's already done.",
        output: "Answers that skip boilerplate and address exactly your situation.",
        tip: "Stack assumptions: 'Assume production environment, 10k daily users, PostgreSQL backend.'"
      },
      {
        cmd: "Do not [restriction]",
        syntax: `Do not use recursion. Do not explain what the code does. Only show the final function.`,
        when: "When you know what you DON'T want as much as what you do.",
        where: "After your main request as a constraint block.",
        how: "Be specific. 'Don't be verbose' is weak. 'No explanations, no comments, code only' is strong.",
        output: "Output stripped of everything you don't need.",
        tip: "Use negatives to shape style: 'Do not use passive voice. Do not use filler phrases like \"certainly\" or \"great question\".'"
      }
    ]
  },
  {
    category: "🔄 Iteration & Refinement Commands",
    color: "#10B981",
    commands: [
      {
        cmd: "Give me [N] variations",
        syntax: `Give me 5 variations of this email subject line, ranging from formal to playful.`,
        when: "When exploring options rather than committing to one answer.",
        where: "After defining the base request.",
        how: "Specify N and the dimension of variation (tone, style, length, approach).",
        output: "A curated set of options you can pick from, combine, or iterate on.",
        tip: "Add labels: 'Label each variation: [Formal], [Casual], [Urgent], [Curious], [Bold].'"
      },
      {
        cmd: "Improve this by [criteria]",
        syntax: `Improve this by making it 50% shorter, more direct, and starting with the key insight.`,
        when: "When you have a draft and want targeted improvement.",
        where: "After pasting your existing content.",
        how: "Name specific improvement axes — don't just say 'make it better'.",
        output: "Improved version that addresses exactly the weaknesses you named.",
        tip: "Request a diff: 'Show what changed and why in a brief note after the revised version.'"
      },
      {
        cmd: "What's missing from [X]?",
        syntax: `What's missing from this system design that could cause it to fail at scale?`,
        when: "For gap analysis, code review, argument critique, or plan evaluation.",
        where: "After presenting your work for review.",
        how: "Frame with the failure mode you're worried about.",
        output: "Critical blind spots you hadn't considered, surfaced proactively.",
        tip: "'What assumptions am I making in this prompt that might lead to a wrong answer?'"
      }
    ]
  },
  {
    category: "📐 Few-Shot / Example Commands",
    color: "#3B82F6",
    commands: [
      {
        cmd: "Here's an example: [example]. Now do [task]",
        syntax: `Here's an example:\nInput: "fix bug" → Output: "Resolved issue where null pointer caused crash on login."\n\nNow convert these: "add feature", "refactor code", "update docs"`,
        when: "When the format or style is hard to describe but easy to show.",
        where: "Before your actual task — examples first, then the real input.",
        how: "Provide 1–3 examples that cover the pattern. More is usually overkill.",
        output: "Outputs that match your example's style, tone, and structure exactly.",
        tip: "Show a bad example too: 'This is wrong: [bad]. This is right: [good]. Now apply to:...'"
      },
      {
        cmd: "Follow this pattern: [pattern]",
        syntax: `Follow this pattern:\n[Problem]: [Root Cause]: [Fix]: [Prevention]:\n\nApply to: "App crashes when uploading files > 10MB"`,
        when: "When you have a specific analytical or writing framework to apply.",
        where: "Provide the pattern inline, then the input to process.",
        how: "Use brackets as placeholders. Fill one row yourself if ambiguous.",
        output: "Consistent, structured outputs across many inputs — great for batch processing.",
        tip: "Name your framework: 'Use the 5 Whys framework. Show each \"Why\" as a numbered step.'"
      }
    ]
  },
  {
    category: "🧠 Meta-Prompting Commands",
    color: "#EC4899",
    commands: [
      {
        cmd: "Ask me questions before answering",
        syntax: `I want to build a SaaS product. Before you give advice, ask me the 5 most important questions you need answered first.`,
        when: "When your prompt is underspecified and you know it.",
        where: "Use as the primary instruction — let the model drive clarification.",
        how: "Tell it to ask questions BEFORE responding, not after.",
        output: "You fill in gaps the model identified, then get a much more targeted answer.",
        tip: "'Ask me exactly 3 clarifying questions. Then wait for my answers before proceeding.'"
      },
      {
        cmd: "Rate your confidence [in answer]",
        syntax: `After your answer, rate your confidence from 1–10 and explain what you're uncertain about.`,
        when: "For factual, technical, or legal questions where accuracy is critical.",
        where: "After your main question.",
        how: "Ask for a number AND reasoning — numbers without reasoning aren't useful.",
        output: "Built-in epistemic honesty that flags where to double-check with other sources.",
        tip: "'If confidence < 7, list what additional information would increase your certainty.'"
      },
      {
        cmd: "Steelman / Devil's advocate",
        syntax: `Steelman the strongest argument AGAINST my proposed solution before we proceed.`,
        when: "Before making a decision, writing a persuasive piece, or stress-testing a plan.",
        where: "As a preliminary step before the main task.",
        how: "Ask for the strongest version of the opposing view, not a weak critique.",
        output: "Reveals blind spots, strengthens your own argument, and surfaces real risks.",
        tip: "'Give the steelman in 3 points. Then give your own assessment of each point's validity.'"
      }
    ]
  }
];

export default function PromptCheatSheet() {
  const [activeCategory, setActiveCategory] = useState(0);
  const [activeCmd, setActiveCmd] = useState(0);
  const [copied, setCopied] = useState(null);

  const copy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  };

  const cat = data[activeCategory];
  const cmd = cat.commands[activeCmd];

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0A0A0F",
      fontFamily: "'Courier New', monospace",
      color: "#E2E8F0",
      display: "flex",
      flexDirection: "column"
    }}>
      {/* Header */}
      <div style={{
        borderBottom: "1px solid #1E1E2E",
        padding: "24px 32px",
        background: "linear-gradient(135deg, #0A0A0F 0%, #12121E 100%)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "4px" }}>
          <span style={{ fontSize: "22px" }}>⚡</span>
          <h1 style={{
            margin: 0,
            fontSize: "20px",
            fontWeight: "700",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "#fff"
          }}>Prompt Engineering Cheat Sheet</h1>
        </div>
        <p style={{ margin: 0, fontSize: "12px", color: "#6B7280", letterSpacing: "0.08em" }}>
          CMD + CODE + WHEN + WHERE + HOW — for every technique
        </p>
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "hidden", minHeight: 0 }}>
        {/* Sidebar: Categories */}
        <div style={{
          width: "240px",
          minWidth: "240px",
          borderRight: "1px solid #1E1E2E",
          overflowY: "auto",
          padding: "16px 0"
        }}>
          {data.map((cat, i) => (
            <button
              key={i}
              onClick={() => { setActiveCategory(i); setActiveCmd(0); }}
              style={{
                width: "100%",
                textAlign: "left",
                padding: "12px 20px",
                background: activeCategory === i ? `${cat.color}18` : "transparent",
                border: "none",
                borderLeft: activeCategory === i ? `3px solid ${cat.color}` : "3px solid transparent",
                cursor: "pointer",
                color: activeCategory === i ? cat.color : "#6B7280",
                fontSize: "12px",
                fontFamily: "'Courier New', monospace",
                letterSpacing: "0.04em",
                lineHeight: "1.5",
                transition: "all 0.15s"
              }}
            >
              {cat.category}
            </button>
          ))}
        </div>

        {/* Middle: Command List */}
        <div style={{
          width: "200px",
          minWidth: "200px",
          borderRight: "1px solid #1E1E2E",
          overflowY: "auto",
          padding: "16px 0"
        }}>
          <div style={{ padding: "0 16px 12px", fontSize: "10px", color: "#4B5563", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Commands
          </div>
          {cat.commands.map((c, i) => (
            <button
              key={i}
              onClick={() => setActiveCmd(i)}
              style={{
                width: "100%",
                textAlign: "left",
                padding: "10px 16px",
                background: activeCmd === i ? `${cat.color}15` : "transparent",
                border: "none",
                borderLeft: activeCmd === i ? `2px solid ${cat.color}` : "2px solid transparent",
                cursor: "pointer",
                color: activeCmd === i ? "#E2E8F0" : "#6B7280",
                fontSize: "12px",
                fontFamily: "'Courier New', monospace",
                transition: "all 0.15s"
              }}
            >
              <code style={{
                background: activeCmd === i ? `${cat.color}25` : "#1E1E2E",
                padding: "2px 6px",
                borderRadius: "4px",
                fontSize: "11px",
                color: activeCmd === i ? cat.color : "#9CA3AF"
              }}>
                {c.cmd}
              </code>
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px" }}>
          {/* Command title */}
          <div style={{ marginBottom: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
              <span style={{
                background: `${cat.color}20`,
                color: cat.color,
                border: `1px solid ${cat.color}40`,
                padding: "4px 12px",
                borderRadius: "6px",
                fontSize: "13px",
                fontWeight: "700",
                fontFamily: "'Courier New', monospace"
              }}>
                {cmd.cmd}
              </span>
            </div>
          </div>

          {/* Syntax block */}
          <Section label="📝 Syntax / Example" color={cat.color}>
            <div style={{
              background: "#0D0D17",
              border: `1px solid ${cat.color}30`,
              borderRadius: "8px",
              padding: "16px",
              position: "relative"
            }}>
              <button
                onClick={() => copy(cmd.syntax, "syntax")}
                style={{
                  position: "absolute", top: "10px", right: "10px",
                  background: copied === "syntax" ? cat.color : "#1E1E2E",
                  color: copied === "syntax" ? "#000" : "#9CA3AF",
                  border: "none", borderRadius: "4px", padding: "4px 10px",
                  fontSize: "10px", cursor: "pointer", fontFamily: "'Courier New', monospace",
                  transition: "all 0.2s"
                }}
              >
                {copied === "syntax" ? "✓ Copied" : "Copy"}
              </button>
              <pre style={{
                margin: 0, fontSize: "13px", color: "#E2E8F0",
                whiteSpace: "pre-wrap", lineHeight: "1.7"
              }}>
                {cmd.syntax}
              </pre>
            </div>
          </Section>

          {/* When / Where / How */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "16px" }}>
            <InfoCard label="⏰ WHEN to Use" text={cmd.when} color={cat.color} />
            <InfoCard label="📍 WHERE to Place" text={cmd.where} color={cat.color} />
            <InfoCard label="🔧 HOW to Write It" text={cmd.how} color={cat.color} />
          </div>

          {/* Output */}
          <Section label="✅ What Output You Get" color={cat.color}>
            <div style={{
              background: "#0A1A0F",
              border: "1px solid #16A34A30",
              borderRadius: "8px",
              padding: "14px 16px",
              fontSize: "13px",
              color: "#86EFAC",
              lineHeight: "1.7"
            }}>
              {cmd.output}
            </div>
          </Section>

          {/* Pro Tip */}
          <Section label="💡 Pro Tip" color={cat.color}>
            <div style={{
              background: `${cat.color}0D`,
              border: `1px solid ${cat.color}30`,
              borderRadius: "8px",
              padding: "14px 16px",
              fontSize: "13px",
              color: "#E2E8F0",
              lineHeight: "1.7",
              position: "relative"
            }}>
              <button
                onClick={() => copy(cmd.tip, "tip")}
                style={{
                  position: "absolute", top: "10px", right: "10px",
                  background: copied === "tip" ? cat.color : "#1E1E2E",
                  color: copied === "tip" ? "#000" : "#9CA3AF",
                  border: "none", borderRadius: "4px", padding: "4px 10px",
                  fontSize: "10px", cursor: "pointer", fontFamily: "'Courier New', monospace",
                  transition: "all 0.2s"
                }}
              >
                {copied === "tip" ? "✓ Copied" : "Copy"}
              </button>
              <code style={{ color: cat.color }}>{cmd.tip}</code>
            </div>
          </Section>

          {/* Navigation */}
          <div style={{ display: "flex", gap: "10px", marginTop: "28px" }}>
            {activeCmd > 0 && (
              <button onClick={() => setActiveCmd(activeCmd - 1)} style={navBtn("#1E1E2E", "#9CA3AF")}>
                ← Prev
              </button>
            )}
            {activeCmd < cat.commands.length - 1 && (
              <button onClick={() => setActiveCmd(activeCmd + 1)} style={navBtn(cat.color, "#000")}>
                Next →
              </button>
            )}
            {activeCategory < data.length - 1 && activeCmd === cat.commands.length - 1 && (
              <button onClick={() => { setActiveCategory(activeCategory + 1); setActiveCmd(0); }}
                style={navBtn(data[activeCategory + 1].color, "#000")}>
                Next Category →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ label, color, children }) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <div style={{
        fontSize: "11px", color: "#6B7280", letterSpacing: "0.1em",
        textTransform: "uppercase", marginBottom: "8px"
      }}>
        {label}
      </div>
      {children}
    </div>
  );
}

function InfoCard({ label, text, color }) {
  return (
    <div style={{
      background: "#0D0D17",
      border: "1px solid #1E1E2E",
      borderRadius: "8px",
      padding: "14px"
    }}>
      <div style={{ fontSize: "10px", color, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "8px" }}>
        {label}
      </div>
      <div style={{ fontSize: "12px", color: "#CBD5E1", lineHeight: "1.6" }}>{text}</div>
    </div>
  );
}

function navBtn(bg, color) {
  return {
    background: bg, color, border: "none", borderRadius: "6px",
    padding: "8px 18px", fontSize: "12px", cursor: "pointer",
    fontFamily: "'Courier New', monospace", fontWeight: "700",
    transition: "opacity 0.2s"
  };
}