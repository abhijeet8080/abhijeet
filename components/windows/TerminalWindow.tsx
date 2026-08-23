"use client";

import { useEffect, useRef, useState } from "react";
import { useWindowStore } from "@/store/windowStore";
import { scrollToSection } from "@/lib/navigation";
import { playThocc, playError } from "@/lib/sounds";
import { profile, socials, experience, selected_works, works } from "@/constant";
import { skillsData } from "@/constant/skills";

interface Line {
  id: number;
  kind: "input" | "output" | "error";
  text: string;
}

const PROMPT = "abhijeet@abhi-os";
const CWD = "~";

const ALL_PROJECTS = [...selected_works, ...works];

const HELP_TEXT = [
  "Available commands:",
  "  help          show this message",
  "  whoami        who is abhijeet?",
  "  about         short bio",
  "  education     degree & university",
  "  skills        tech stack",
  "  experience    work history",
  "  projects      things I've built",
  "  socials       where to find me",
  "  contact       email & phone",
  "  resume        open my resume (pdf)",
  "  quote         words I live by",
  "  open <name>   jump to a section (about/skills/experience/work/contact)",
  "  wallpaper     open wallpaper settings",
  "  date          current date & time",
  "  echo <text>   say something",
  "  pwd / ls      you know these",
  "  clear         clear the terminal",
  "  exit          close the terminal",
];

const COMMANDS = [
  "help", "whoami", "about", "education", "skills", "experience",
  "projects", "socials", "contact", "email", "resume", "quote",
  "open", "wallpaper", "date", "echo", "pwd", "ls", "cat", "clear", "exit",
];

let lineId = 0;
const makeLine = (kind: Line["kind"], text: string): Line => ({
  id: lineId++,
  kind,
  text,
});

const WELCOME: Line[] = [
  makeLine("output", "Last login: " + new Date().toDateString() + " on ttys000"),
  makeLine("output", "Welcome to abhi os — type `help` to get started."),
];

export const TerminalWindow = () => {
  const [lines, setLines] = useState<Line[]>(WELCOME);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { closeWindow, openWindow } = useWindowStore();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  const print = (text: string | string[], kind: Line["kind"] = "output") => {
    const arr = Array.isArray(text) ? text : [text];
    setLines((prev) => [...prev, ...arr.map((t) => makeLine(kind, t))]);
  };

  const runCommand = (raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed) return;

    const [cmd, ...args] = trimmed.split(/\s+/);
    const arg = args.join(" ");

    switch (cmd.toLowerCase()) {
      case "help":
        print(HELP_TEXT);
        break;
      case "whoami":
        print([
          `${profile.name.full} — ${profile.work.title} @ ${profile.work.company}`,
          "Full stack engineer building production AI systems.",
        ]);
        break;
      case "about":
        print(profile.about[0]);
        break;
      case "education":
        print([
          `${profile.education.uni}`,
          `${profile.education.degree} in ${profile.education.major} · ${profile.education.batch}`,
          `${profile.education.location.city}, ${profile.education.location.state} · CGPA 8.93/10`,
        ]);
        break;
      case "skills":
        skillsData.forEach((group) => {
          print(`${group.title}: ${group.data.map((s) => s.title).join(", ")}`);
        });
        break;
      case "experience":
        experience.forEach((job) => {
          print([
            `${job.role} @ ${job.company} (${job.startDate.mm} ${job.startDate.yyyy} — ${job.current ? "Present" : `${job.endDate.mm} ${job.endDate.yyyy}`})`,
            ...job.description.map((d) => `  • ${d}`),
          ]);
        });
        break;
      case "projects":
        ALL_PROJECTS.forEach((p, i) => {
          print(`${String(i + 1).padStart(2, "0")}. ${p.name} — ${p.technologies.slice(0, 4).join(", ")}`);
        });
        print("Tip: scroll to the Work section for the full cards.");
        break;
      case "socials":
        socials.forEach((s) => print(`${s.name.padEnd(10)} ${s.url || s.handle}`));
        break;
      case "contact":
      case "email":
        print([`email  ${profile.email}`, `phone  ${profile.phone}`]);
        break;
      case "resume":
        print("Opening resume.pdf …");
        window.open("/resume.pdf", "_blank");
        break;
      case "quote":
        print(`“${profile.quote}” — ${profile.name.full}`);
        break;
      case "open": {
        const target = arg.toLowerCase();
        const sections = ["about", "skills", "experience", "work", "contact"];
        if (sections.includes(target)) {
          print(`Opening ${target} …`);
          closeWindow("terminal");
          setTimeout(() => scrollToSection(target), 250);
        } else if (target === "settings" || target === "wallpaper") {
          openWindow("settings", "settings", "System Settings");
        } else if (target === "resume") {
          window.open("/resume.pdf", "_blank");
        } else {
          print(`open: no such target: ${target || "(empty)"}`, "error");
        }
        break;
      }
      case "wallpaper":
        openWindow("settings", "settings", "System Settings");
        break;
      case "date":
        print(new Date().toString());
        break;
      case "echo":
        print(arg);
        break;
      case "pwd":
        print(`/Users/abhijeet`);
        break;
      case "ls":
        print("Desktop  Documents  Projects  resume.pdf  .secrets");
        break;
      case "cat":
        if (arg === ".secrets") print("nice try.", "error");
        else print(`cat: ${arg || "(empty)"}: No such file or directory`, "error");
        break;
      case "sudo":
        playError();
        print("abhijeet is not in the sudoers file. This incident will be reported.", "error");
        break;
      case "rm":
        playError();
        print("rm: permission denied — and honestly, rude.", "error");
        break;
      case "clear":
        setLines([]);
        return;
      case "exit":
        closeWindow("terminal");
        return;
      default:
        playError();
        print(`zsh: command not found: ${cmd} — try \`help\``, "error");
    }
  };

  const handleSubmit = () => {
    const raw = input;
    setLines((prev) => [...prev, makeLine("input", raw)]);
    if (raw.trim()) {
      setHistory((prev) => [raw, ...prev]);
    }
    setHistoryIndex(-1);
    setInput("");
    runCommand(raw);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length === 0) return;
      const next = Math.min(historyIndex + 1, history.length - 1);
      setHistoryIndex(next);
      setInput(history[next]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = historyIndex - 1;
      setHistoryIndex(next);
      setInput(next >= 0 ? history[next] : "");
    } else if (e.key === "Tab") {
      e.preventDefault();
      const match = COMMANDS.find((c) => c.startsWith(input.toLowerCase()));
      if (match && input) setInput(match);
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    } else if (e.key.length === 1) {
      playThocc();
    }
  };


  return (
    <div
      className="flex h-full flex-col bg-[#0D0D0F]/95 font-mono"
      onClick={() => inputRef.current?.focus()}
    >
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-3 py-2 text-[13px] leading-relaxed"
      >
        {lines.map((line) => (
          <div
            key={line.id}
            className={
              line.kind === "input"
                ? "whitespace-pre-wrap text-white/90"
                : line.kind === "error"
                  ? "whitespace-pre-wrap text-[#FF5F57]"
                  : "whitespace-pre-wrap text-[#28C840]/90"
            }
          >
            {line.kind === "input" ? (
              <>
                <span className="text-os-accent">{PROMPT}</span>
                <span className="text-white/50"> {CWD} % </span>
                {line.text}
              </>
            ) : (
              line.text
            )}
          </div>
        ))}

        {/* Active prompt line */}
        <div className="flex items-center whitespace-pre">
          <span className="text-os-accent">{PROMPT}</span>
          <span className="text-white/50"> {CWD} % </span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            className="flex-1 bg-transparent text-white/90 caret-[#28C840] outline-none"
            spellCheck={false}
            autoComplete="off"
            autoCapitalize="off"
            aria-label="Terminal input"
          />
        </div>
      </div>
    </div>
  );
};

export default TerminalWindow;

