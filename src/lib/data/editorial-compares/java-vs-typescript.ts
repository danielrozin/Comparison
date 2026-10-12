import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * Java vs TypeScript.
 * Java: the Java Language Specification, Java SE 27; the OpenJDK JDK 27
 * project; and Oracle's Java product summary.
 * TypeScript: typescriptlang.org, the handbook chapter for new programmers,
 * and the compiler's Apache License 2.0.
 * No winner.
 */

const JAVA = "java";
const TYPESCRIPT = "typescript";

const JLS = "https://docs.oracle.com/en/java/javase/27/docs/specs/jls/jls-1.html";
const JDK27 = "https://openjdk.org/projects/jdk/27/";
const ORACLE_JAVA = "https://www.oracle.com/java/";
const TS_HOME = "https://www.typescriptlang.org/";
const TS_HANDBOOK = "https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html";
const TS_LICENSE = "https://github.com/microsoft/TypeScript/blob/main/LICENSE.txt";

const SOURCE_DATE = "2026-10-03";
const PUBLISHED = "2026-10-03T00:00:00Z";
const SPEC = "Language";

const SHORT_ANSWER =
  "Java is a class-based, object-oriented language that compiles to Java Virtual Machine bytecode. JDK 27 reached general availability on 15 September 2026. TypeScript is JavaScript with syntax for types. It erases those types and emits JavaScript that runs in a browser, on Node.js, Deno, or Bun. TypeScript 7.0 is available. There is no winner.";

const FAQS = [
  {
    question: "What is Java?",
    answer:
      "Java is a general-purpose, concurrent, class-based, object-oriented language. It is strongly and statically typed. Compile time normally translates a program into a machine-independent bytecode representation. That bytecode is the instruction set and binary format in the Java Virtual Machine Specification, Java SE 27 Edition. Java includes automatic storage management, typically using a garbage collector. A class has a single superclass.",
  },
  {
    question: "What is TypeScript?",
    answer:
      "TypeScript is JavaScript with syntax for types. It is a strongly typed language that builds on JavaScript, and it is a typed superset of JavaScript, so JavaScript syntax is legal TypeScript. TypeScript is a static type checker. It preserves JavaScript runtime behavior and does not change it. After checking, it erases the types and emits JavaScript. It does not add a TypeScript runtime library. TypeScript 7.0 is available. The compiler is under the Apache License 2.0.",
  },
  {
    question: "Where does each language run?",
    answer:
      "A Java program is normally compiled to bytecode for a Java Virtual Machine. TypeScript code converts to JavaScript, which runs anywhere JavaScript runs: in a browser, on Node.js, Deno, Bun, and in apps. The two do not share a runtime.",
  },
  {
    question: "How do the type systems differ?",
    answer:
      "Java is strongly and statically typed. The language distinguishes compile-time errors from errors that occur at run time. TypeScript checks a program before execution based on the kinds of values. It uses type inference, and types can be added to a JavaScript project incrementally. Those types are erased. TypeScript never changes how the JavaScript runs, including when the type checker reports an error.",
  },
  {
    question: "Which release is current?",
    answer:
      "JDK 27 is the Reference Implementation of version 27 of the Java SE Platform, specified by JSR 402. It reached general availability on 15 September 2026. Oracle reports that Java 27 is available, and that JDK 27 delivers a post-quantum cryptography milestone. OpenJDK lists Post-Quantum Hybrid Key Exchange for TLS 1.3 among the JDK 27 features. TypeScript 7.0 is available.",
  },
  {
    question: "Which one should you use?",
    answer:
      "Use Java for a class-based language that compiles to Java Virtual Machine bytecode. Use TypeScript when the program should stay JavaScript, with static types that are erased before it runs in a browser, on Node.js, Deno, or Bun. There is no winner.",
  },
];

const VERDICT = `Best fit for JVM bytecode: Java. It is a general-purpose, class-based, object-oriented language. JDK 27, the Java SE 27 reference implementation, reached general availability on 15 September 2026.

Best fit for typed JavaScript: TypeScript. It is JavaScript with syntax for types. The compiler erases those types and emits JavaScript for a browser, Node.js, Deno, or Bun. TypeScript 7.0 is available under the Apache License 2.0.

There is no single winner.`;

const EXPERT_ANALYSIS = `Choose Java when the program should compile to Java Virtual Machine bytecode. Choose TypeScript when the program should be JavaScript with static types. There is no winner.

Language

Java is a general-purpose, concurrent, class-based, object-oriented language. It is strongly and statically typed, and it is related to C and C++ but organized differently. A class has one superclass. Classes and interfaces may be generic. Java includes automatic storage management, typically using a garbage collector.

TypeScript is JavaScript with syntax for types. It is a strongly typed language that builds on JavaScript. JavaScript syntax is legal TypeScript. TypeScript shares syntax and runtime behavior with JavaScript.

Runtime

Java compile time normally translates programs into machine-independent bytecode. That bytecode is defined by the Java Virtual Machine Specification, Java SE 27 Edition. Run time loads and links the classes, and can generate machine code and optimize the program while it runs.

TypeScript converts to JavaScript. That JavaScript runs anywhere JavaScript runs: in a browser, on Node.js, Deno, Bun, and in apps. TypeScript erases types and does not add a runtime library. It never changes JavaScript runtime behavior.

Types

Java detects a set of errors at compile time and others at run time. Primitive types are the same on every machine: two's-complement integers, IEEE 754 floating-point numbers, boolean, and char.

TypeScript is a static type checker. It uses type inference, and types can be applied to an existing JavaScript project one step at a time. The types are removed from the emitted JavaScript, so they do not change how the program runs.

Release and license

JDK 27 is the Reference Implementation of Java SE 27, JSR 402. General availability was 15 September 2026. Production-ready binaries under the GPL are available from Oracle. JDK 27 includes Post-Quantum Hybrid Key Exchange for TLS 1.3. Oracle reports millions of developers running more than 73 billion Java Virtual Machines worldwide, and that Java 27 is available.

TypeScript 7.0 is available. The TypeScript compiler is under the Apache License 2.0.

Who should use which

Use Java for programs that compile to JVM bytecode and run on a Java Virtual Machine. Use TypeScript for JavaScript codebases that need static checking, with the finished program still running as JavaScript. There is no winner.`;

export const JAVA_VS_TYPESCRIPT: EditorialComparison = buildEditorialComparison({
  slug: "java-vs-typescript",
  title: "Java vs TypeScript",
  shortAnswer: SHORT_ANSWER,
  verdict: VERDICT,
  category: "software",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: JAVA,
      slug: JAVA,
      name: "Java",
      shortDesc: "A class-based, object-oriented language that compiles to Java Virtual Machine bytecode.",
      imageUrl: null,
      entityType: "software",
      position: 0,
      pros: [
        "General-purpose, concurrent, class-based, object-oriented language",
        "Strongly and statically typed, with compile-time translation to JVM bytecode",
        "Automatic storage management, typically using a garbage collector",
        "JDK 27 reached general availability on 15 September 2026",
      ],
      cons: [
        "Programs run on a Java Virtual Machine, not as JavaScript in a browser or on Node.js, Deno, or Bun",
        "Structured concurrency, primitive types in patterns, and lazy constants are still previews in JDK 27",
      ],
      bestFor: "Best for programs that compile to JVM bytecode",
    },
    {
      id: TYPESCRIPT,
      slug: TYPESCRIPT,
      name: "TypeScript",
      shortDesc: "JavaScript with syntax for types. TypeScript 7.0 emits JavaScript.",
      imageUrl: null,
      entityType: "software",
      position: 1,
      pros: [
        "JavaScript with syntax for types, and JavaScript syntax is legal TypeScript",
        "Static type checking with type inference, applied incrementally",
        "Emits JavaScript for a browser, Node.js, Deno, or Bun",
        "Apache License 2.0, and TypeScript 7.0 is available",
      ],
      cons: [
        "Types are erased, so they are not present in the JavaScript that runs",
        "The emitted program needs a JavaScript runtime, not a Java Virtual Machine",
        "TypeScript does not change JavaScript runtime behavior when the type checker reports an error",
      ],
      bestFor: "Best for typed JavaScript",
    },
  ],
  keyDifferences: [
    {
      label: "Language",
      entityAValue: "Class-based, object-oriented, strongly and statically typed",
      entityBValue: "JavaScript with syntax for types",
      winner: "tie",
    },
    {
      label: "Output",
      entityAValue: "Java Virtual Machine bytecode",
      entityBValue: "JavaScript, with types erased",
      winner: "tie",
    },
    {
      label: "Where it runs",
      entityAValue: "A Java Virtual Machine",
      entityBValue: "A browser, Node.js, Deno, or Bun",
      winner: "tie",
    },
    {
      label: "Current release",
      entityAValue: "JDK 27, general availability 15 September 2026",
      entityBValue: "TypeScript 7.0",
      winner: "tie",
    },
    {
      label: "License",
      entityAValue: "JDK 27 binaries under the GPL, from Oracle",
      entityBValue: "Apache License 2.0",
      winner: "tie",
    },
  ],
  attributes: [
    textAttr(
      "language",
      "Language",
      SPEC,
      JAVA,
      TYPESCRIPT,
      "General-purpose, concurrent, class-based, and object-oriented. Strongly and statically typed. A class has one superclass",
      "JavaScript with syntax for types. A typed superset of JavaScript, so JavaScript syntax is legal TypeScript",
    ),
    textAttr(
      "types",
      "Types",
      SPEC,
      JAVA,
      TYPESCRIPT,
      "Compile-time errors are separate from run-time errors. Primitive types match on every machine",
      "Static type checker with type inference. Types are erased and do not change JavaScript runtime behavior",
    ),
    textAttr(
      "output",
      "Compiler output",
      SPEC,
      JAVA,
      TYPESCRIPT,
      "Machine-independent bytecode for the Java Virtual Machine Specification, Java SE 27",
      "JavaScript. No extra TypeScript runtime library",
    ),
    textAttr(
      "runtimes",
      "Where it runs",
      SPEC,
      JAVA,
      TYPESCRIPT,
      "A Java Virtual Machine. Oracle reports more than 73 billion Java Virtual Machines",
      "Anywhere JavaScript runs: a browser, Node.js, Deno, or Bun",
    ),
    textAttr(
      "release",
      "Current release",
      SPEC,
      JAVA,
      TYPESCRIPT,
      "JDK 27, Java SE 27 reference implementation (JSR 402). General availability 15 September 2026. Includes post-quantum hybrid key exchange for TLS 1.3",
      "TypeScript 7.0",
    ),
    textAttr(
      "license",
      "License",
      SPEC,
      JAVA,
      TYPESCRIPT,
      "Production-ready JDK 27 binaries under the GPL are available from Oracle",
      "Apache License 2.0",
    ),
  ],
  faqs: FAQS,
  relatedComparisons: [],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: {
    tldr: SHORT_ANSWER,
    winnerName: null,
    winnerReason:
      "Java for programs that compile to JVM bytecode. TypeScript for JavaScript with static types that are erased before the program runs.",
    keyFact:
      "JDK 27 reached general availability on 15 September 2026, and TypeScript 7.0 is available.",
  },
  citationStats: {
    sourceCount: 6,
    dataPointCount: 6,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: SOURCE_DATE,
    sources: [
      { name: "Oracle — Java Language Specification, Java SE 27", url: JLS },
      { name: "OpenJDK — JDK 27", url: JDK27 },
      { name: "Oracle — Java", url: ORACLE_JAVA },
      { name: "TypeScript", url: TS_HOME },
      { name: "TypeScript — handbook for new programmers (last updated 28 September 2026)", url: TS_HANDBOOK },
      { name: "TypeScript — Apache License 2.0", url: TS_LICENSE },
    ],
  },
  resources: [
    {
      type: "external",
      label: "Java Language Specification, Java SE 27",
      url: JLS,
      description:
        "General-purpose, class-based, object-oriented language. Strongly and statically typed. Compiles to JVM bytecode.",
    },
    {
      type: "external",
      label: "JDK 27",
      url: JDK27,
      description:
        "Java SE 27 reference implementation, JSR 402. General availability 15 September 2026. GPL binaries from Oracle. Post-quantum hybrid key exchange for TLS 1.3.",
    },
    {
      type: "external",
      label: "Oracle Java",
      url: ORACLE_JAVA,
      description:
        "Java 27 is available. Oracle reports millions of developers running more than 73 billion Java Virtual Machines.",
    },
    {
      type: "external",
      label: "TypeScript",
      url: TS_HOME,
      description:
        "JavaScript with syntax for types. Emits JavaScript for a browser, Node.js, Deno, or Bun. TypeScript 7.0 is available.",
    },
    {
      type: "external",
      label: "TypeScript for new programmers",
      url: TS_HANDBOOK,
      description:
        "Typed superset of JavaScript. Static type checker. Types are erased and JavaScript runtime behavior stays the same.",
    },
    {
      type: "external",
      label: "TypeScript license",
      url: TS_LICENSE,
      description: "The TypeScript compiler is under the Apache License 2.0.",
    },
  ],
  metaTitle: "Java vs TypeScript | A Versus B",
});
