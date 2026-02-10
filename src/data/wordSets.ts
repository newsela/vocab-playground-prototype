export interface ContextClueData {
  sentence: string;
  targetWord: string;
  clueWords: string[];
  options: string[];
}

export interface HotOrNotData {
  sentence: string;
  targetWord: string;
  isCorrectUsage: boolean;
}

export interface IntensityData {
  concept: string;
  words: string[];
}

export interface SynonymSwapData {
  sentence: string;
  targetWord: string;
  options: string[];
  imposter: string;
}

export interface PasskeysData {
  themeHint: string;
  words: [string, string, string]; // 3 words: 4, 5, 6 letters
  wordHints: [string, string, string]; // per-word academic clue (part of speech, synonym, etc.)
}

export interface WordSet {
  id: number;
  targetWord: string;
  articleTitle: string;
  articleExcerpts: string[];           // multiple excerpts for rotation
  contextClues: ContextClueData[];    // multiple rounds
  hotOrNot: HotOrNotData[];           // 5 rounds per set
  intensity: IntensityData;
  synonymSwaps: SynonymSwapData[];    // multiple rounds
  passkeys: PasskeysData;             // word guessing game
}

export const wordSets: WordSet[] = [
  // ── 1. RESILIENT ──────────────────────────────────────────
  {
    id: 1,
    targetWord: "Resilient",
    articleTitle: "The Secret Language of Trees",
    articleExcerpts: [
      `Deep in the forest, trees communicate through an underground network of fungi. Scientists call it the "Wood Wide Web." Through this network, older trees share nutrients with younger ones, helping the entire forest survive droughts and storms.

When a tree is damaged by insects or disease, it sends chemical signals through its roots. Neighboring trees receive these warnings and boost their own defenses. This makes the whole forest more **resilient** — able to recover from setbacks that would destroy a single tree standing alone.

Researchers have found that forests with strong underground networks recover faster from wildfires. The trees that survive share resources with new seedlings, rebuilding what was lost. It's a powerful reminder that strength often comes from connection.`,

      `After a wildfire swept through Yellowstone National Park in 1988, many people thought the forest was destroyed forever. Charred trunks stretched for miles, and the landscape looked lifeless.

But scientists who returned the following spring discovered something remarkable. Green shoots were already pushing through the blackened soil. Some pine cones had actually needed the fire's heat to open and release their seeds. The forest was more **resilient** than anyone had imagined.

Today, Yellowstone's post-fire forest is thriving. It's home to more plant species than before, with meadows of wildflowers growing where dense, old trees once blocked the sun. Nature's ability to bounce back continues to amaze researchers.`,
    ],
    contextClues: [
      {
        sentence: "The forest proved to be remarkably [REDACTED], recovering from the devastating wildfire within just a few years thanks to its underground network.",
        targetWord: "resilient",
        clueWords: ["recovering", "devastating", "network"],
        options: ["resilient", "fragile", "ancient", "remote"],
      },
      {
        sentence: "Despite losing their home in the storm, the [REDACTED] family rebuilt and came back even stronger than before.",
        targetWord: "resilient",
        clueWords: ["rebuilt", "stronger", "despite"],
        options: ["resilient", "wealthy", "fortunate", "cautious"],
      },
      {
        sentence: "Engineers designed the bridge to be [REDACTED], able to flex during earthquakes without cracking or collapsing.",
        targetWord: "resilient",
        clueWords: ["flex", "earthquakes", "collapsing"],
        options: ["resilient", "enormous", "decorative", "temporary"],
      },
    ],
    hotOrNot: [
      { sentence: "After the earthquake, the resilient community rebuilt their homes and schools within a year.", targetWord: "resilient", isCorrectUsage: true },
      { sentence: "The glass vase was so resilient that it shattered into a thousand pieces when it fell.", targetWord: "resilient", isCorrectUsage: false },
      { sentence: "Her resilient attitude helped her bounce back from the disappointing test score.", targetWord: "resilient", isCorrectUsage: true },
      { sentence: "The old rubber band was still resilient enough to snap right back into shape.", targetWord: "resilient", isCorrectUsage: true },
      { sentence: "The sandcastle was resilient, lasting only a few minutes before the waves washed it away.", targetWord: "resilient", isCorrectUsage: false },
    ],
    intensity: {
      concept: "Strength / Recovery",
      words: ["fragile", "sturdy", "tough", "resilient"],
    },
    synonymSwaps: [
      {
        sentence: "The community showed how **resilient** they were after the flood.",
        targetWord: "resilient",
        options: ["tough", "strong", "delicate", "hardy"],
        imposter: "delicate",
      },
      {
        sentence: "Children can be incredibly **resilient** when given the right support after a setback.",
        targetWord: "resilient",
        options: ["adaptable", "durable", "breakable", "persistent"],
        imposter: "breakable",
      },
      {
        sentence: "The **resilient** economy recovered faster than economists predicted.",
        targetWord: "resilient",
        options: ["robust", "enduring", "frail", "tenacious"],
        imposter: "frail",
      },
    ],
    passkeys: {
      themeHint: "Words related to being resilient",
      words: ["GRIT", "TOUGH", "BOUNCE"],
      wordHints: [
        "Noun — courage and resolve; synonym: perseverance",
        "Adjective — strong enough to withstand difficulty",
        "Verb — to spring back after impact; synonym: rebound",
      ],
    },
  },

  // ── 2. AUTOMATE ───────────────────────────────────────────
  {
    id: 2,
    targetWord: "Automate",
    articleTitle: "The Rise of the Robot Chef",
    articleExcerpts: [
      `In a small kitchen in San Francisco, a robot named "Flippy" flips burgers on a hot grill. It never gets tired, never burns its fingers, and never forgets an order. Flippy is part of a growing trend: using machines to **automate** tasks that humans have done for centuries.

Automation isn't just about robots. When your school sends automatic reminders about homework, that's automation too. Any time a machine or computer program handles a repeated task without human help, that process has been automated.

But automation raises big questions. If machines do more work, what happens to the people who used to do those jobs? Some experts say automation creates new types of jobs we haven't imagined yet. Others worry that the change is happening too fast.`,

      `Every morning at 6 a.m., the greenhouses at BrightFarms water themselves. Sensors measure the moisture in the soil, and if a plant is thirsty, a tiny valve opens to deliver exactly the right amount of water. No human needs to be there at all.

This is what it means to **automate** a process — to set up a system that runs on its own. The farm uses software to track temperature, light, and humidity around the clock, making adjustments automatically.

The result? The automated greenhouse uses 80% less water than a traditional farm and produces food year-round. Automation doesn't just replace human effort — it can do things humans simply can't, like monitoring thousands of plants every second.`,
    ],
    contextClues: [
      {
        sentence: "The factory decided to [REDACTED] the packaging process, replacing human workers with machines that could seal boxes three times faster.",
        targetWord: "automate",
        clueWords: ["factory", "replacing", "machines"],
        options: ["automate", "celebrate", "decorate", "hesitate"],
      },
      {
        sentence: "To save time on repetitive tasks, the teacher used software to [REDACTED] grading for multiple-choice quizzes.",
        targetWord: "automate",
        clueWords: ["repetitive", "software", "grading"],
        options: ["automate", "memorize", "criticize", "dramatize"],
      },
      {
        sentence: "The city plans to [REDACTED] its traffic lights so they adjust timing based on real-time traffic data instead of fixed schedules.",
        targetWord: "automate",
        clueWords: ["adjust", "real-time", "schedules"],
        options: ["automate", "eliminate", "illustrate", "investigate"],
      },
    ],
    hotOrNot: [
      { sentence: "The company decided to automate its email responses so customers would get instant replies.", targetWord: "automate", isCorrectUsage: true },
      { sentence: "She tried to automate the painting, carefully adding each brushstroke by hand.", targetWord: "automate", isCorrectUsage: false },
      { sentence: "Farmers can automate watering by using timers connected to their sprinkler systems.", targetWord: "automate", isCorrectUsage: true },
      { sentence: "The library decided to automate the checkout process with self-service scanning stations.", targetWord: "automate", isCorrectUsage: true },
      { sentence: "He wanted to automate his essay, so he spent three hours writing every paragraph himself.", targetWord: "automate", isCorrectUsage: false },
    ],
    intensity: {
      concept: "Modernization",
      words: ["traditional", "updated", "mechanized", "automated"],
    },
    synonymSwaps: [
      {
        sentence: "The school district plans to **automate** attendance tracking next year.",
        targetWord: "automate",
        options: ["mechanize", "computerize", "handwrite", "streamline"],
        imposter: "handwrite",
      },
      {
        sentence: "Engineers worked to **automate** the assembly line so it could run overnight.",
        targetWord: "automate",
        options: ["program", "systematize", "dismantle", "digitize"],
        imposter: "dismantle",
      },
      {
        sentence: "The hospital decided to **automate** prescription refills for patients with chronic conditions.",
        targetWord: "automate",
        options: ["standardize", "modernize", "complicate", "simplify"],
        imposter: "complicate",
      },
    ],
    passkeys: {
      themeHint: "Things related to machines doing work",
      words: ["SCAN", "ROBOT", "SYSTEM"],
      wordHints: [
        "Verb — to examine or read systematically",
        "Noun — a machine that performs tasks automatically",
        "Noun — an organized set of processes; synonym: framework",
      ],
    },
  },

  // ── 3. DIVERSE ────────────────────────────────────────────
  {
    id: 3,
    targetWord: "Diverse",
    articleTitle: "How Coral Reefs Build Underwater Cities",
    articleExcerpts: [
      `A coral reef is like an underwater city bustling with life. Thousands of different species — fish, sea turtles, octopuses, and tiny shrimp — all share this colorful habitat. Scientists say coral reefs are among the most **diverse** ecosystems on Earth.

This diversity isn't just beautiful; it's essential for survival. When many different species live together, the ecosystem becomes stronger. If one type of fish disappears, others can fill its role. A reef with only a few species would be much more fragile.

Climate change threatens this diversity. Warmer oceans cause coral bleaching, which destroys the habitat that supports all these creatures. Protecting coral reefs means protecting the incredible variety of life that depends on them.`,

      `In one square mile of rainforest, you might find 400 species of trees, 150 species of butterflies, and more types of ants than exist in all of Great Britain. The Amazon rainforest is one of the most **diverse** places on Earth.

Why does this variety matter? Each species plays a role. Some birds spread seeds. Certain fungi break down dead leaves into soil. Bats pollinate flowers that only open at night. Remove one species, and the whole web starts to unravel.

Scientists call this "biodiversity," and they've discovered something surprising: the most diverse ecosystems are also the most stable. When there are many different species working together, the system can adapt to changes that would devastate a simpler one.`,
    ],
    contextClues: [
      {
        sentence: "The coral reef's [REDACTED] ecosystem includes over 4,000 different species of fish, making it one of the richest habitats on the planet.",
        targetWord: "diverse",
        clueWords: ["different", "species", "richest"],
        options: ["diverse", "shallow", "tropical", "endangered"],
      },
      {
        sentence: "The classroom became more [REDACTED] after students from twelve different countries enrolled, each bringing unique perspectives and traditions.",
        targetWord: "diverse",
        clueWords: ["different", "countries", "unique"],
        options: ["diverse", "crowded", "expensive", "popular"],
      },
      {
        sentence: "A [REDACTED] selection of books on the library shelf included mysteries, science fiction, poetry, biographies, and graphic novels.",
        targetWord: "diverse",
        clueWords: ["selection", "mysteries", "science fiction", "poetry"],
        options: ["diverse", "dusty", "overdue", "digital"],
      },
    ],
    hotOrNot: [
      { sentence: "Our school's diverse student body includes families from over thirty different countries.", targetWord: "diverse", isCorrectUsage: true },
      { sentence: "The desert was so diverse that only one type of cactus could survive there.", targetWord: "diverse", isCorrectUsage: false },
      { sentence: "A diverse diet with many types of fruits and vegetables keeps you healthier.", targetWord: "diverse", isCorrectUsage: true },
      { sentence: "The music festival featured a diverse lineup, from jazz to hip-hop to classical.", targetWord: "diverse", isCorrectUsage: true },
      { sentence: "The team was so diverse that every single member had the exact same background and experience.", targetWord: "diverse", isCorrectUsage: false },
    ],
    intensity: {
      concept: "Variety",
      words: ["uniform", "mixed", "varied", "diverse"],
    },
    synonymSwaps: [
      {
        sentence: "The rainforest has a remarkably **diverse** collection of plant species.",
        targetWord: "diverse",
        options: ["varied", "assorted", "identical", "wide-ranging"],
        imposter: "identical",
      },
      {
        sentence: "Our neighborhood is wonderfully **diverse**, with people from many different backgrounds.",
        targetWord: "diverse",
        options: ["eclectic", "multifaceted", "homogeneous", "rich"],
        imposter: "homogeneous",
      },
      {
        sentence: "The museum's **diverse** exhibits range from ancient Egypt to modern street art.",
        targetWord: "diverse",
        options: ["broad", "extensive", "narrow", "comprehensive"],
        imposter: "narrow",
      },
    ],
    passkeys: {
      themeHint: "Words about being different and varied",
      words: ["RICH", "BROAD", "UNIQUE"],
      wordHints: [
        "Adjective — abundant in variety; synonym: plentiful",
        "Adjective — wide in range or scope; antonym: narrow",
        "Adjective — one of a kind; synonym: distinctive",
      ],
    },
  },

  // ── 4. INNOVATE ───────────────────────────────────────────
  {
    id: 4,
    targetWord: "Innovate",
    articleTitle: "The Kids Who Invented Something New",
    articleExcerpts: [
      `You don't have to be a grown-up to change the world. Throughout history, young people have found creative solutions to everyday problems. They prove that anyone can **innovate** — you just need curiosity and the courage to try something different.

Take 11-year-old Gitanjali Rao, who invented a device to detect lead in drinking water. Or 15-year-old Jack Andraka, who developed a new test for pancreatic cancer. These young inventors didn't wait for permission to innovate; they saw problems and started experimenting.

Innovation doesn't always mean inventing a new gadget. Sometimes it means finding a better way to organize your classroom, or creating a new game at recess. Every time you solve a problem in a way nobody has tried before, you're innovating.`,

      `In 1930, a 16-year-old farm boy from Idaho named Philo Farnsworth had a wild idea. While plowing a potato field, he looked at the neat rows of dirt and imagined sending pictures through the air in rows — just like the furrows in the field. That idea became television.

Farnsworth didn't have a fancy lab or wealthy investors. He had curiosity and a willingness to **innovate**. He built his first working TV transmitter in a small apartment, using parts he scrounged and borrowed.

History is full of people who innovated not because they had the best resources, but because they refused to accept that something was impossible. From the Wright brothers' bicycle shop to a college dorm room where Facebook began, the best innovations often start in the most unexpected places.`,
    ],
    contextClues: [
      {
        sentence: "The young scientist decided to [REDACTED] by designing a completely new kind of water filter that no one had ever attempted before.",
        targetWord: "innovate",
        clueWords: ["scientist", "new", "attempted"],
        options: ["innovate", "imitate", "hesitate", "migrate"],
      },
      {
        sentence: "Rather than following the same old recipe, the chef chose to [REDACTED], combining ingredients in surprising ways that no cookbook had ever suggested.",
        targetWord: "innovate",
        clueWords: ["combining", "surprising", "new"],
        options: ["innovate", "duplicate", "terminate", "refrigerate"],
      },
      {
        sentence: "The students were challenged to [REDACTED] during the science fair by inventing original solutions to real-world problems in their community.",
        targetWord: "innovate",
        clueWords: ["inventing", "original", "solutions"],
        options: ["innovate", "memorize", "organize", "summarize"],
      },
    ],
    hotOrNot: [
      { sentence: "The tech company continues to innovate, releasing groundbreaking products every year.", targetWord: "innovate", isCorrectUsage: true },
      { sentence: "He chose to innovate by copying exactly what his competitor had already done.", targetWord: "innovate", isCorrectUsage: false },
      { sentence: "Teachers who innovate find creative new ways to help students learn difficult concepts.", targetWord: "innovate", isCorrectUsage: true },
      { sentence: "The architect decided to innovate with a building design that had never been attempted before.", targetWord: "innovate", isCorrectUsage: true },
      { sentence: "The company failed to innovate, proudly doing everything the same way for fifty years.", targetWord: "innovate", isCorrectUsage: false },
    ],
    intensity: {
      concept: "Creativity",
      words: ["copy", "adapt", "create", "innovate"],
    },
    synonymSwaps: [
      {
        sentence: "The company encourages employees to **innovate** and think outside the box.",
        targetWord: "innovate",
        options: ["invent", "pioneer", "replicate", "experiment"],
        imposter: "replicate",
      },
      {
        sentence: "Schools that **innovate** often find better ways to engage students in learning.",
        targetWord: "innovate",
        options: ["modernize", "revolutionize", "stagnate", "transform"],
        imposter: "stagnate",
      },
      {
        sentence: "The team needed to **innovate** quickly to solve the unexpected engineering challenge.",
        targetWord: "innovate",
        options: ["improvise", "brainstorm", "conform", "devise"],
        imposter: "conform",
      },
    ],
    passkeys: {
      themeHint: "Words about creating something new",
      words: ["IDEA", "CRAFT", "INVENT"],
      wordHints: [
        "Noun — a thought or suggestion; synonym: concept",
        "Verb — to make something with skill and care",
        "Verb — to create something that didn't exist before",
      ],
    },
  },

  // ── 5. SCARCE ─────────────────────────────────────────────
  {
    id: 5,
    targetWord: "Scarce",
    articleTitle: "Water Wars: When Rivers Run Dry",
    articleExcerpts: [
      `In many parts of the world, clean water is becoming increasingly **scarce**. Rivers that once flowed year-round are drying up. Underground water sources are being pumped faster than rain can refill them. For millions of people, finding enough water to drink, cook, and grow food is a daily struggle.

When resources become scarce, competition grows fierce. Countries that share rivers sometimes disagree about who gets to use the water. Farmers and cities compete for the same supply. These "water wars" are becoming more common as the climate changes.

But scarcity also drives creativity. Engineers are designing better desalination plants that turn ocean water into drinking water. Communities are learning to capture and recycle every drop. When something becomes scarce, people find remarkable ways to make the most of what's available.`,

      `During World War II, everyday items that Americans had taken for granted suddenly became **scarce**. Rubber, metal, sugar, and gasoline were all needed for the war effort, leaving very little for regular families.

The government started a rationing program. Each family received small booklets of stamps that limited how much they could buy. Sugar was limited to half a pound per person per week. Families learned to stretch meals, mend clothes instead of buying new ones, and grow vegetables in "Victory Gardens."

What's remarkable is how people adapted. When butter was scarce, they used margarine. When new tires were unavailable, they patched old ones. Scarcity forced people to be creative — and many of those habits, like growing your own food, are making a comeback today.`,
    ],
    contextClues: [
      {
        sentence: "During the long drought, clean drinking water became so [REDACTED] that families had to wait in line for hours just to fill a single bucket.",
        targetWord: "scarce",
        clueWords: ["drought", "wait", "single"],
        options: ["scarce", "abundant", "polluted", "expensive"],
      },
      {
        sentence: "As winter approached, food grew [REDACTED] in the forest, forcing the animals to travel farther each day to find something to eat.",
        targetWord: "scarce",
        clueWords: ["winter", "forcing", "farther", "find"],
        options: ["scarce", "frozen", "dangerous", "tasteless"],
      },
      {
        sentence: "Hospital supplies became [REDACTED] during the crisis, with nurses rationing bandages and doctors reusing equipment that would normally be thrown away.",
        targetWord: "scarce",
        clueWords: ["rationing", "reusing", "crisis"],
        options: ["scarce", "sterile", "modern", "expensive"],
      },
    ],
    hotOrNot: [
      { sentence: "After the hurricane, fresh food became scarce and stores had empty shelves for weeks.", targetWord: "scarce", isCorrectUsage: true },
      { sentence: "Water was so scarce that the river flooded the entire valley.", targetWord: "scarce", isCorrectUsage: false },
      { sentence: "Jobs became scarce during the recession, making it hard for graduates to find work.", targetWord: "scarce", isCorrectUsage: true },
      { sentence: "Good mechanics are scarce in this small town — there's only one shop for fifty miles.", targetWord: "scarce", isCorrectUsage: true },
      { sentence: "Sunlight was scarce at the beach, pouring down so brightly that everyone needed sunscreen.", targetWord: "scarce", isCorrectUsage: false },
    ],
    intensity: {
      concept: "Availability (high → low)",
      words: ["abundant", "sufficient", "limited", "scarce"],
    },
    synonymSwaps: [
      {
        sentence: "Clean water has become **scarce** in many regions affected by drought.",
        targetWord: "scarce",
        options: ["rare", "sparse", "plentiful", "insufficient"],
        imposter: "plentiful",
      },
      {
        sentence: "Affordable housing is **scarce** in big cities, leaving many families struggling.",
        targetWord: "scarce",
        options: ["uncommon", "meager", "abundant", "hard to find"],
        imposter: "abundant",
      },
      {
        sentence: "During the shortage, basic supplies like flour and rice became **scarce** at grocery stores.",
        targetWord: "scarce",
        options: ["depleted", "lacking", "overflowing", "dwindling"],
        imposter: "overflowing",
      },
    ],
    passkeys: {
      themeHint: "Words about having very little",
      words: ["RARE", "EMPTY", "MEAGER"],
      wordHints: [
        "Adjective — not found in large numbers; antonym: common",
        "Adjective — containing nothing; synonym: vacant",
        "Adjective — lacking in quantity; synonym: scant",
      ],
    },
  },

  // ── 6. COLLABORATE ────────────────────────────────────────
  {
    id: 6,
    targetWord: "Collaborate",
    articleTitle: "The Space Station: Working Together in Orbit",
    articleExcerpts: [
      `The International Space Station (ISS) orbits Earth at 17,500 miles per hour. It's one of the most complex machines ever built — and no single country could have built it alone. The ISS exists because nations that sometimes disagree on Earth learned to **collaborate** in space.

Fifteen countries contributed to building and operating the station. American astronauts, Russian cosmonauts, and crew members from Japan, Europe, and Canada live and work together in a space smaller than a six-bedroom house. They share meals, conduct experiments, and depend on each other for survival.

Collaboration on the ISS goes beyond just being polite. Every spacewalk requires a partner. Every scientific experiment builds on someone else's work. The station itself was assembled piece by piece, with modules built in different countries and connected in orbit. It's proof that when people collaborate, they can achieve things that seem impossible alone.`,

      `In the 1960s, a group of musicians in Liverpool, England, changed music forever — not because any one of them was the greatest musician alive, but because they learned to **collaborate**.

John Lennon and Paul McCartney would sit across from each other and write songs together, each one pushing the other to be better. George Harrison brought influences from Indian music that neither of them would have discovered alone. Even Ringo Starr's steady drumming gave the others freedom to experiment.

The Beatles showed that collaboration isn't about everyone being the same. It's about different people bringing different strengths to a shared goal. When they stopped collaborating and went solo, none of them matched what they'd achieved together. The whole truly was greater than the sum of its parts.`,
    ],
    contextClues: [
      {
        sentence: "Scientists from fifteen different countries had to [REDACTED] closely, sharing data and equipment to build the space station piece by piece.",
        targetWord: "collaborate",
        clueWords: ["countries", "sharing", "together"],
        options: ["collaborate", "compete", "celebrate", "complicate"],
      },
      {
        sentence: "The two schools decided to [REDACTED] on the community garden project, with each group contributing different skills and supplies.",
        targetWord: "collaborate",
        clueWords: ["schools", "contributing", "different", "together"],
        options: ["collaborate", "commute", "calculate", "calibrate"],
      },
      {
        sentence: "When the musicians decided to [REDACTED], combining their unique styles, they created a sound that none of them could have produced alone.",
        targetWord: "collaborate",
        clueWords: ["combining", "unique", "alone"],
        options: ["collaborate", "choreograph", "compensate", "contradict"],
      },
    ],
    hotOrNot: [
      { sentence: "The two classes decided to collaborate on the science fair project, combining their research.", targetWord: "collaborate", isCorrectUsage: true },
      { sentence: "She preferred to collaborate by working alone in her room with the door locked.", targetWord: "collaborate", isCorrectUsage: false },
      { sentence: "Musicians from different genres collaborate to create exciting new sounds.", targetWord: "collaborate", isCorrectUsage: true },
      { sentence: "The nonprofits chose to collaborate, pooling their resources to help more families.", targetWord: "collaborate", isCorrectUsage: true },
      { sentence: "The rival companies decided to collaborate by refusing to share any information with each other.", targetWord: "collaborate", isCorrectUsage: false },
    ],
    intensity: {
      concept: "Togetherness",
      words: ["solo", "cooperative", "united", "collaborative"],
    },
    synonymSwaps: [
      {
        sentence: "The students chose to **collaborate** on the group project instead of working alone.",
        targetWord: "collaborate",
        options: ["partner", "team up", "isolate", "cooperate"],
        imposter: "isolate",
      },
      {
        sentence: "Doctors and nurses must **collaborate** to give patients the best possible care.",
        targetWord: "collaborate",
        options: ["coordinate", "work together", "compete", "consult"],
        imposter: "compete",
      },
      {
        sentence: "The artists decided to **collaborate** on a mural that represented their whole community.",
        targetWord: "collaborate",
        options: ["join forces", "co-create", "withdraw", "unite"],
        imposter: "withdraw",
      },
    ],
    passkeys: {
      themeHint: "Words about working together",
      words: ["TEAM", "UNITE", "EFFORT"],
      wordHints: [
        "Noun — a group working toward a shared goal",
        "Verb — to come together as one; synonym: join",
        "Noun — a determined attempt; synonym: endeavor",
      ],
    },
  },
];
