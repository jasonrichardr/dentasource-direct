export const categories = [
    { id: 'all', label: 'All Products' },
    { id: 'imaging', label: 'Imaging' },
    { id: 'endo', label: 'Endodontics' },
    { id: 'curing', label: 'Curing & Filling' },
    { id: 'sterilization', label: 'Sterilization' },
    { id: 'accessories', label: 'Accessories' },
];

export const products = [
    // ─── DENTAL CHAIRS ────────────────────────────────
    {
        slug: 'roson-dxa3',
        name: 'Roson Flagship Model A3',
        category: 'chair',
        badge: 'Flagship',
        tagline: 'Clinical Excellence, Perfected.',
        shortDesc: 'Experience the new standard in patient comfort and intelligent operatory design with EOW disinfection and an intuitive touchscreen panel.',
        description: 'The Roson Flagship Model A3 is the crown jewel of DentaSource Direct. Designed for practices demanding uncompromising clinical standards, it integrates technology once exclusive to the highest-end European units. A built-in Electrolytic Oxidized Water (EOW) system actively neutralizes 99.9999% of waterline bacteria. Workflow is dramatically improved through an intuitive medical-grade color LCD, while dual infrared sensors auto-fill cups hands-free. Patients experience profound comfort on ultra-breathable, pressure-mapping seamless leather, driven by a whisper-silent motor.',
        features: [
            'Worry-free waterline safety with EOW disinfection system (eliminates 99.9999% of bacteria)',
            'See every detail with the 8-bead Philips LED sensor light (adjustable color temp)',
            'Intuitive workflow via medical-grade color LCD touchscreen panel',
            'Smart dual-induction water supply auto-fills cup hands-free',
            'Integrated thermostatic water heating system for patient comfort',
            'Anti-collision assistant arm prevents equipment damage or injury',
            'Three customizable memory positions and one-key smart drainage',
            'Built to last: Whisper-Silent Motor and SMC polyether pipelines',
        ],
        advancedFeatures: [
            {
                title: "Shadowless Optical Headlamp",
                description: "8-bead Philips LED array provides full-arch visibility with adjustable color temperatures, reducing eye strain during long procedures."
            },
            {
                title: "Command Center LCD",
                description: "Intuitive medical-grade color touchscreen streamlines your workflow, putting every chair function at your fingertips."
            },
            {
                title: "Smart Auto-Fill System",
                description: "Dual IR and gravity sensors automatically fill the patient cup hands-free, preventing cross-contamination."
            },
            {
                title: "Thermostatic Delivery",
                description: "Integrated water heating ensures patient comfort during rinsing, reducing sensitivity shocks."
            },
            {
                title: "Active Collision Avoidance",
                description: "Intelligent sensors in the assistant arm and backrest halt movement instantly to prevent equipment damage or injury."
            },
            {
                title: "Memory Positioning",
                description: "Three rapid-recall memory positions plus a one-key smart drainage setting optimize turnaround times between patients."
            },
            {
                title: "Whisper-Quiet Drive",
                description: "Whisper-Silent Motor provides buttery-smooth, near-silent adjustments that put anxious patients at ease."
            },
            {
                title: "SMC Polyether Pipelines",
                description: "Highly durable, anti-corrosive internal plumbing ensures consistent pressure and longevity, backed by a 5-year warranty."
            }
        ],
        disinfectionDeepDive: {
            title: "Revolutionary EOW-TECH Active Safety",
            subtitle: "Uncompromising Infection Control",
            features: [
                {
                    name: "Exceptional Disinfection",
                    desc: "Actively eliminates 99.9999% of bacteria, setting a new standard for dental waterline hygiene without relying on harsh chemical additives."
                },
                {
                    name: "Biofilm Prevention",
                    desc: "Continuous micro-electrolysis inhibits biofilm formation in the SMC pipelines, significantly reducing cross-contamination risks."
                },
                {
                    name: "Non-Toxic & Gentle",
                    desc: "Produces safe, medically-verified active oxygen clusters for irritation-free patient rinsing."
                },
                {
                    name: "Corrosion-Free Technology",
                    desc: "Zero free chlorine ions are produced, protecting your dental unit's internal metal valves and components from premature wear."
                }
            ]
        },
        ergonomicsDeepDive: {
            title: "Engineered for Practitioner Longevity",
            subtitle: "The RS06 Ergonomic Dentist Stool",
            features: [
                "Eight-way dynamic adjustability supports diverse body types",
                "Maintains natural spine curvature to prevent fatigue",
                "5° forward tilt capability for optimal access posture",
                "Prevents femoral artery blockage during long procedures",
                "Ultra-breathable, non-deformable high-density cushioning",
                "360° silent casters on a sturdy aluminum alloy base"
            ]
        },
        specs: {
            'Model': 'KLT-6220',
            'Motor': 'Whisper-Silent Motor (soft start/stop)',
            'Upholstery': 'Breathable seamless microfiber leather (5-year warranty)',
            'Light': 'RoLight 8-bead LED (3-year warranty)',
            'Display': 'Medical-grade color LCD',
            'Disinfection': 'EOW electrolytic oxidized water',
            'Water System': 'Dual IR & gravity sensing',
            'Pipelines': 'SMC Polyether (5-year warranty)',
            'Warranty': '2 years (1st year parts + service, 2nd year service)',
            'Origin': 'Foshan Roson Medical, China',
        },
        images: ['/images/products/sunlit/chair_a3_blue_sunlight.png', '/images/products/dxa3/lcd.jpg', '/images/products/dxa3/cuspidor.jpg', '/images/products/dxa3/light.jpg', '/images/products/dxa3/panel.jpg'],
        heroImage: '/images/products/sunlit/chair_a3_blue_sunlight.png',
        configuratorEnabled: true,
        configuratorOptions: {
            colors: [
                { name: 'Classic Blue', value: '#4A90D9', image: '/images/configurator/dxa3-classic-blue.jpg' },
                { name: 'Coloured Glaze Blue', value: '#6BA3D6', image: '/images/configurator/dxa3-glaze-blue.jpg' },
                { name: 'Gray', value: '#8C8C8C', image: '/images/configurator/dxa3-gray.jpg' },
                { name: 'Begonia Red', value: '#C93756', image: '/images/configurator/dxa3-red.jpg' },
                { name: 'Hermes Orange', value: '#F37321', image: '/images/configurator/dxa3-orange.jpg' },
                { name: 'Olive Green', value: '#6B8E23', image: '/images/configurator/dxa3-olive.jpg' },
                { name: 'Tiffany Blue', value: '#81D8D0', image: '/images/configurator/dxa3-tiffany.jpg' },
                { name: 'Light Green', value: '#90EE90', image: '/images/configurator/dxa3-lightgreen.jpg' },
            ],
            handpiece: ['Over-the-Patient', 'Swing-Mounted', 'Cart-Mounted'],
            upholstery: ['PU Leather', 'Sewn Microfiber Leather', 'Seamless Microfiber Leather'],
        },
    },
    {
        slug: 'roson-s9',
        name: 'Roson Affordable Luxury Model S9',
        category: 'chair',
        badge: 'Flagship',
        tagline: 'Your Practice, Elevated.',
        shortDesc: 'Deliver exceptional patient experiences and boost your clinical efficiency with the S9 Signature dental chair, featuring active EOW-TECH water disinfection.',
        description: 'The Roson S9 Signature is more than a dental chair; it is an investment in your practice\'s growth and your patients\' peace of mind. Experience the perfect balance of premium comfort and unyielding reliability. Featuring our industry-leading EOW-TECH active water disinfection system, the S9 ensures absolute safety while its butter-smooth articulation keeps even the most anxious patients relaxed. Upgrade to the S9 and transform how your operatory looks, feels, and performs.',
        features: [
            'Active EOW-TECH water line disinfection for uncompromising safety',
            'Jitter-free, ultra-quiet Whisper-Silent Motor ensures patient relaxation',
            'Premium, easy-to-sanitize upholstery withstands heavy daily use',
            'Space-saving, highly efficient assistant module',
            'Intelligent anti-collision safety system protects your investment',
            'Integrated 5-in-1 utility center keeps the operatory pristine',
            'Intuitive medical-grade color touchscreen Command Center',
            'One-touch Smart Drainage position accelerates turnaround times',
        ],
        advancedFeatures: [
            {
                title: "Shadowless LED Illumination",
                description: "The 8-Tooth Smile Oral Light delivers broad, pristine visibility across the entire oral cavity, reducing eye strain simply and effectively."
            },
            {
                title: "Whisper-Smooth Articulation",
                description: "Our Whisper-Silent Motor guarantees butter-smooth transitions with soft start/stop. Keep your patients completely relaxed and comfortable."
            },
            {
                title: "Designed for Efficiency",
                description: "The streamlined assistant unit maximizes your workspace, putting essential suction and instruments right where you need them."
            },
            {
                title: "Intuitive Touch Control",
                description: "Manage your entire workflow effortlessly with the integrated medical-grade color LCD touchscreen display."
            },
            {
                title: "Active Collision Prevention",
                description: "Smart sensors instantly halt the backrest if an obstruction is detected, safeguarding your staff and your equipment."
            },
            {
                title: "Pristine Organization",
                description: "A built-in 5-in-1 tissue and utility integration box ensures your operatory always looks impeccably tidy and professional."
            },
            {
                title: "Rapid Patient Turnaround",
                description: "Boost your daily tempo. Optimize workflow with the One-Key Smart Drainage setting for instant transition to the spittoon."
            },
            {
                title: "Luxury Meets Durability",
                description: "The premium upholstery is engineered for the demands of a high-volume clinic while remaining exceptionally easy to sanitize."
            }
        ],
        disinfectionDeepDive: {
            title: "Revolutionary EOW-TECH Safety",
            subtitle: "Uncompromising Infection Control for Total Peace of Mind",
            features: [
                {
                    name: "Active 99.9999% Disinfection",
                    desc: "Sets a new standard in clinical hygiene by actively eliminating bacteria without relying on harsh chemicals."
                },
                {
                    name: "Proactive Biofilm Prevention",
                    desc: "Continuous micro-electrolysis safeguards the internal pipelines, drastically reducing cross-contamination risks."
                },
                {
                    name: "Eco-Friendly & Gentle",
                    desc: "Produces safe, active oxygen clusters. Water is the only by-product, ensuring irritation-free patient use."
                },
                {
                    name: "Smart Adapting System",
                    desc: "Sophisticated technology auto-adapts to your local water conditions for guaranteed sterilization performance."
                }
            ]
        },
        ergonomicsDeepDive: {
            title: "Engineered for Practitioner Longevity",
            subtitle: "The RS06 Ergonomic Dentist Stool",
            features: [
                "Eight-way dynamic adjustability supports diverse body types",
                "Maintains natural spine curvature to prevent fatigue",
                "5° forward tilt capability for optimal access posture",
                "Prevents femoral artery blockage during long procedures",
                "Ultra-breathable, non-deformable high-density cushioning",
                "360° silent casters on a sturdy aluminum alloy base"
            ]
        },
        specs: {
            'Motor': 'Whisper-Silent Motor (soft start/stop)',
            'Upholstery': 'Breathable Seamless Microfiber Leather (5-year warranty)',
            'Light': 'RoLight Dental Light (3-year warranty)',
            'Display': 'Medical-grade color LCD',
            'Disinfection': 'EOW electrolytic oxidized water',
            'Pipelines': 'SMC Polyether (5-year warranty)',
            'Warranty': '2 years (1st year parts + service, 2nd year service)',
            'Origin': 'Foshan Roson Medical, China',
        },
        images: ['/images/products/sunlit/chair_s9_sunlight_no_plants_1774303865259.png'],
        heroImage: '/images/products/s9/main.jpg',
        configuratorEnabled: true,
        configuratorOptions: {
            colors: [
                { name: 'Classic Blue', value: '#4A90D9', image: '/images/configurator/s9-classic-blue.jpg' },
                { name: 'Coloured Glaze Blue', value: '#6BA3D6', image: '/images/configurator/s9-glaze-blue.jpg' },
                { name: 'Gray', value: '#8C8C8C', image: '/images/configurator/s9-gray.jpg' },
                { name: 'Begonia Red', value: '#C93756', image: '/images/configurator/s9-red.jpg' },
                { name: 'Olive Green', value: '#6B8E23', image: '/images/configurator/s9-olive.jpg' },
            ],
            handpiece: ['Over-the-Patient', 'Swing-Mounted', 'Cart-Mounted'],
            upholstery: ['PU Leather', 'Sewn Microfiber Leather', 'Seamless Microfiber Leather'],
        },
    },
    {
        slug: 'roson-dxa3l',
        name: 'Roson Fashion Model A3L',
        category: 'chair',
        badge: null,
        tagline: 'Same A3 Power. Your Clinic\'s Style.',
        shortDesc: 'Same A3 flagship platform with fashion-forward design customization — EOW-TECH disinfection, Whisper-Silent Motor, and LCD display included.',
        description: 'The Fashion Model A3L delivers the exact same core technology as our flagship A3 — EOW-TECH electrolytic disinfection, Whisper-Silent Motor, medical-grade color LCD, and dual IR + gravity sensing water — but wrapped in a fashion-forward aesthetic that lets you customize the look and feel of your operatory. Same engineering, your style.',
        features: [
            'German-engineered arm joints — 4x the wear life of standard arms, found only on high-end dental chairs',
            'Whisper-Silent Motor with soft start/stop for buttery-smooth chair movement',
            'Medical-grade color LCD with self-check diagnostics and 3 memory positions',
            'Anti-collision assistant arm auto-pauses on obstacle detection',
            'Dual IR & gravity sensing water system for touchless cup filling',
            'One-Key Smart Drainage — single button triggers 5-minute auto-cleaning cycle',
            'Fashion-forward design customization — choose your clinic\'s signature look',
            'SMC polyether pipelines with 5-year warranty',
        ],
        advancedFeatures: [
            {
                title: "Fashion-Forward Customization",
                description: "Same A3 platform, but with expanded aesthetic options — customize colors, upholstery, and design elements to match your clinic's brand identity."
            },
            {
                title: "EOW-TECH Active Disinfection",
                description: "Built-in electrolytic oxidized water system eliminates 99.9999% of bacteria. No chemicals, no residues — just safe, clean waterlines."
            },
            {
                title: "Whisper-Silent Motor",
                description: "5-year warranted motor with soft start/stop — patients describe it as 'sitting on a cloud.' Zero jarring movements."
            },
            {
                title: "Smart Command LCD",
                description: "Medical-grade color touchscreen with power-on self-test, fault code display, 3 memory positions, and built-in clock/timer."
            }
        ],
        ergonomicsDeepDive: {
            title: "Engineered for Practitioner Longevity",
            subtitle: "The RS06 Ergonomic Dentist Stool",
            features: [
                "Eight-way dynamic adjustability supports diverse body types",
                "Maintains natural spine curvature to prevent fatigue",
                "5° forward tilt capability for optimal access posture",
                "Prevents femoral artery blockage during long procedures",
                "Ultra-breathable, non-deformable high-density cushioning",
                "360° silent casters on a sturdy aluminum alloy base"
            ]
        },
        specs: {
            'Model': 'KLT-6220 A3L',
            'Motor': 'Whisper-Silent Motor (soft start/stop)',
            'Upholstery': 'PU Leather standard (Microfiber upgrade available)',
            'Light': 'RoLight 8-bead Philips LED (3-year warranty)',
            'Display': 'Medical-grade color LCD',
            'Disinfection': 'EOW-TECH electrolytic oxidized water (optional)',
            'Water System': 'Dual IR & gravity sensing (optional)',
            'Pipelines': 'Polyether tubing',
            'Warranty': '2 years (1st year parts + service, 2nd year service)',
            'Origin': 'Foshan Roson Medical, China',
        },
        images: ['/images/products/sunlit/chair_a3l_brown_sunlight.png', '/images/products/dxa3l/detail.jpg', '/images/products/dxa3l/equipment.jpg'],
        configuratorEnabled: false,
    },
    {
        slug: 'roson-dxa3s',
        name: 'Roson Smart Model A3S',
        category: 'chair',
        badge: null,
        tagline: '7 Colors. Smart Comfort. Seamless Leather.',
        shortDesc: 'The most colorful chair in the lineup — 7+ color options, ambient breathing lamp, seamless microfiber leather standard, and soft start/stop comfort.',
        description: 'The Smart Model A3S is built for clinics that want their operatory to make a statement. Choose from 7+ stunning colors — Tiffany Blue, Begonia Red, Olive Green, and more. The A3S comes standard with seamless microfiber leather (not an upgrade), a calming condition breathing lamp, and the same smooth soft start/stop motor system. Smart features, bold design, zero compromise.',
        features: [
            'Seamless microfiber leather comes STANDARD — not an upgrade, not optional',
            '7+ color options: Tiffany Blue, Begonia Red, Olive Green, Gray, Glaze Blue, and more',
            'Condition breathing lamp — ambient light signals chair status, calms anxious patients',
            'Rolight S dental light with Philips LEDs and infrared remote control',
            'Soft start/stop motor system — smooth, silent chair movement',
            '4-angle adjustable handpiece holder (30°–80° range)',
            'Power-on self-test with fault code display for quick diagnostics',
            'Full A3-series delivery systems: over-patient, swing, or cart-mounted',
        ],
        advancedFeatures: [
            {
                title: "Seamless Microfiber Standard",
                description: "Unlike other models where seamless leather is an upgrade, the A3S includes it as standard — superior infection control with zero seam crevices for bacteria."
            },
            {
                title: "Condition Breathing Lamp",
                description: "A soothing ambient light on the chair signals operational status while creating a calming atmosphere that puts anxious patients at ease."
            },
            {
                title: "7+ Color Palette",
                description: "The widest color selection in the entire ROSON lineup — Tiffany Blue, Begonia Red, Olive Green, ROSON Blue, Mountain Blue, Gray, and Glaze Blue."
            },
            {
                title: "Smart Self-Diagnostics",
                description: "Power-on self-test automatically checks all systems at startup. If something's off, the fault code display tells you exactly what to fix."
            }
        ],
        ergonomicsDeepDive: {
            title: "Engineered for Practitioner Longevity",
            subtitle: "The RS06 Ergonomic Dentist Stool",
            features: [
                "Eight-way dynamic adjustability supports diverse body types",
                "Maintains natural spine curvature to prevent fatigue",
                "5° forward tilt capability for optimal access posture",
                "Prevents femoral artery blockage during long procedures",
                "Ultra-breathable, non-deformable high-density cushioning",
                "360° silent casters on a sturdy aluminum alloy base"
            ]
        },
        specs: {
            'Model': 'KLT-6220 A3S',
            'Motor': 'Soft start/stop electric motor',
            'Upholstery': 'Seamless microfiber leather (standard)',
            'Light': 'Rolight S with Philips LEDs',
            'Handpiece Holder': '4-angle adjustable (30°–80°)',
            'Colors': '7+ options (Tiffany Blue, Begonia Red, Olive Green, Gray, Glaze Blue, Mountain Blue, ROSON Blue)',
            'Warranty': '2 years (1st year parts + service, 2nd year service)',
            'Origin': 'Foshan Roson Medical, China',
        },
        images: ['/images/products/sunlit/chair_a3s_teal_sunlight.png'],
        heroImage: '/images/products/sunlit/chair_a3s_teal_sunlight.png',
        configuratorEnabled: true,
        configuratorOptions: {
            colors: [
                { name: 'Tiffany Blue', value: '#81D8D0', image: '/images/configurator/a3s-tiffany.jpg' },
                { name: 'Begonia Red', value: '#C93756', image: '/images/configurator/a3s-red.jpg' },
                { name: 'Olive Green', value: '#6B8E23', image: '/images/configurator/a3s-olive.jpg' },
                { name: 'Gray', value: '#8C8C8C', image: '/images/configurator/a3s-gray.jpg' },
                { name: 'Coloured Glaze Blue', value: '#6BA3D6', image: '/images/configurator/a3s-glaze-blue.jpg' },
                { name: 'Mountain Blue', value: '#4682B4', image: '/images/configurator/a3s-mountain-blue.jpg' },
                { name: 'ROSON Blue', value: '#2E5090', image: '/images/configurator/a3s-roson-blue.jpg' },
            ],
            handpiece: ['Over-the-Patient', 'Swing-Mounted', 'Cart-Mounted'],
            upholstery: ['Seamless Microfiber Leather (Standard)', 'PU Leather', 'Sewn Microfiber Leather'],
        },
    },
    {
        slug: 'roson-dxs3',
        name: 'Roson Hot-Selling Model S3',
        category: 'chair',
        badge: 'Best Seller',
        tagline: 'ROSON\'s Global Bestseller.',
        shortDesc: 'The world\'s most popular ROSON chair — ≥35,000 lux LED light with autoclavable handle, detachable infection-control components, and a 6-way adjustable stool included.',
        description: 'There\'s a reason the S3 is ROSON\'s global bestseller. It packs a ≥35,000 lux LED sensor light with an autoclavable handle (the brightest in the lineup), a detachable swiveling spittoon bowl, detachable suction filter for easy cleaning, 4-way hands-free foot control, and includes a 6-way adjustable dentist stool — all in a clean workflow design built for high-volume clinics that need reliability above everything else.',
        features: [
            'Brightest light in the lineup: ≥35,000 lux LED sensor with touchless on/off',
            'Autoclavable light handle — sterilize between patients for true infection control',
            'Detachable swiveling spittoon bowl for easy cleaning',
            'Detachable anti-bacteria suction filter — quick-clean, no tools needed',
            '4-way hands-free foot control for chair positioning',
            '6-way adjustable dentist stool included (not sold separately)',
            'Wide elbow support cushion reduces dentist fatigue',
            'Multi-articulated headrest adapts to any patient',
        ],
        advancedFeatures: [
            {
                title: "≥35,000 Lux Illumination",
                description: "The brightest operating light in the entire ROSON lineup. Touchless sensor activation — no physical contact needed between patients."
            },
            {
                title: "Autoclavable Handle",
                description: "The light handle can be removed and sterilized at 134°C in an autoclave — a real infection control advantage most chairs don't offer."
            },
            {
                title: "Detachable Infection Control",
                description: "Both the spittoon bowl and suction filter detach without tools for thorough cleaning — designed for clinics that see 20+ patients daily."
            },
            {
                title: "6-Way Adjustable Stool",
                description: "The S3 includes a fully adjustable 6-way dentist stool as standard — ready to use right out of the box."
            }
        ],
        ergonomicsDeepDive: {
            title: "Built for the Daily Grind",
            subtitle: "Your Growth Partner in Dentistry",
            features: [
                "Wide elbow support cushion reduces upper body fatigue during long procedures",
                "4-way foot control keeps your hands free for clinical work",
                "Multi-articulated headrest accommodates patients of all sizes",
                "Clean workflow design minimizes cross-contamination touchpoints"
            ]
        },
        specs: {
            'Model': 'S3',
            'Motor': '24V DC silent electric motor',
            'Light': 'LED sensor light ≥35,000 lux (autoclavable handle)',
            'Upholstery': 'PU or Microfiber Leather',
            'Foot Control': '4-way hands-free',
            'Spittoon': 'Detachable swiveling bowl',
            'Stool': '6-way adjustable (included)',
            'Delivery Options': 'Over-the-Patient, Swing-Mounted, Cart-Mounted',
            'Warranty': '2 years (1st year parts + service, 2nd year service)',
            'Origin': 'Foshan Roson Medical, China',
        },
        images: ['/images/products/sunlit/chair_s3_sunlight_1774298390858.png'],
        configuratorEnabled: false,
    },
    {
        slug: 'roson-dxs6',
        name: 'Roson Professional Model S6',
        category: 'chair',
        badge: 'Accessibility',
        tagline: 'The Chair That Goes Lower.',
        shortDesc: 'The ONLY ROSON chair with a 380mm lowest position — perfect for elderly, pediatric, and wheelchair patients. Built with casting steel frame for structural durability.',
        description: 'The Professional Model S6 has one feature no other ROSON chair can match: a 380mm lowest chair position — 20mm below the industry standard. For clinics serving elderly patients, children, or wheelchair users, this isn\'t a nice-to-have — it\'s essential. Built on a casting steel frame for maximum structural durability, with a Rolight S dental light (Philips LEDs, infrared control), compact workflow design, and 4-way hands-free foot control.',
        features: [
            'Lowest chair position in the entire ROSON lineup: 380mm (20mm below standard)',
            'Casting steel chair frame and backrest support — maximum structural durability',
            'Rolight S dental light with Philips LEDs and infrared control',
            '4-way hands-free foot control for chair positioning',
            'Compact four-hand operation optimized assistant unit',
            'Stable multi-joint headrest for diverse patient heights',
            'PU or Microfiber Leather upholstery options',
            'All 3 delivery systems: over-patient, swing-mounted, cart-mounted',
        ],
        advancedFeatures: [
            {
                title: "380mm Lowest Position",
                description: "The S6 goes 20mm lower than any other ROSON chair. Elderly patients, children, and wheelchair users can transfer safely and comfortably — no other model can do this."
            },
            {
                title: "Casting Steel Frame",
                description: "While other chairs use standard steel, the S6 features a casting steel frame and backrest support — zero flex under patient weight, built to last 15+ years."
            },
            {
                title: "Rolight S with Philips LEDs",
                description: "Professional-grade dental light with infrared on/off control — no physical contact needed between patients."
            },
            {
                title: "Four-Hand Operation Ready",
                description: "Compact assistant unit designed specifically for four-handed dentistry — everything your assistant needs within arm's reach."
            }
        ],
        ergonomicsDeepDive: {
            title: "Accessibility Without Compromise",
            subtitle: "Designed for Every Patient",
            features: [
                "380mm low position makes wheelchair transfers safe and dignified",
                "Pediatric patients can climb on and off without adult lifting",
                "Elderly patients with mobility issues sit down with confidence",
                "Casting steel frame supports up to 150kg without any structural flex"
            ]
        },
        specs: {
            'Model': 'S6',
            'Motor': '24V DC silent electric motor',
            'Lowest Position': '380mm (below industry standard)',
            'Frame': 'Casting steel (chair frame + backrest support)',
            'Light': 'Rolight S with Philips LEDs (infrared control)',
            'Upholstery': 'PU or Microfiber Leather',
            'Foot Control': '4-way hands-free',
            'Delivery Options': 'Over-the-Patient, Swing-Mounted, Cart-Mounted',
            'Warranty': '2 years (1st year parts + service, 2nd year service)',
            'Origin': 'Foshan Roson Medical, China',
        },
        images: ['/images/products/sunlit/chair_s6_sunlight_1774298410518.png'],
        configuratorEnabled: false,
    },
    {
        slug: 'roson-dxn2-pro',
        name: 'Roson Elite Model N2 PRO',
        category: 'chair',
        badge: 'Proven',
        tagline: 'Trusted by 80,000+ Dentists Worldwide.',
        shortDesc: 'The premium N-series with the widest dentist table (650×315mm), 180° ceramic spittoon, independent disinfectant water, and 5-position handpiece holder with scaler/motor pre-positions.',
        description: 'The N2 PRO is ROSON\'s most-proven dental chair — trusted by over 80,000 dentists worldwide. It features the widest dentist table in the N-series (650×315mm), a 180° rotatable ceramic spittoon, independent disinfectant water supply, intelligent soft start/stop, and a 5-position handpiece holder with dedicated scaler and motor pre-positions. Shield-shape inspired design that symbolizes patient protection.',
        features: [
            'Widest dentist table in the N-series: 650×315mm — more workspace, less clutter',
            '5-position handpiece holder with pre-positions for scaler and micromotor',
            '180° rotatable ceramic spittoon — easier to clean than plastic, lasts longer',
            'Independent disinfectant water supply system for waterline safety',
            'Intelligent soft start/stop — smooth, silent chair movement',
            'Constant temperature warm water for patient comfort',
            'Programmable cup filler and spittoon rinsing',
            'Rolight S dental light with Philips LEDs and infrared control',
        ],
        advancedFeatures: [
            {
                title: "80,000+ Dentists' Choice",
                description: "More dentists worldwide have chosen the N-series platform than any other ROSON line. The N2 PRO is the premium evolution of that trust."
            },
            {
                title: "Widest Workspace",
                description: "At 650×315mm, the N2 PRO's dentist table gives you 5% more surface area than the N2+ — enough to keep every instrument organized and accessible."
            },
            {
                title: "Ceramic Spittoon",
                description: "180° rotatable ceramic cuspidor — more hygienic, more durable, and more professional-looking than standard plastic bowls."
            },
            {
                title: "Independent Disinfection",
                description: "Separate disinfectant water supply keeps your waterlines clean without mixing chemicals into the patient water circuit."
            }
        ],
        ergonomicsDeepDive: {
            title: "Designed for High-Volume Practices",
            subtitle: "Your Growth Partner in Dentistry",
            features: [
                "5-position handpiece holder eliminates fumbling during procedures",
                "Scaler and motor pre-positions save seconds per patient — adds up to hours per week",
                "Detachable suction filter for quick between-patient cleaning",
                "Programmable cup filler and rinsing reduce manual steps"
            ]
        },
        specs: {
            'Model': 'N2 PRO',
            'Motor': 'Intelligent soft start/stop electric motor',
            'Dentist Table': '650×315mm (widest in N-series)',
            'Handpiece Holder': '5-position with scaler/motor pre-positions',
            'Spittoon': '180° rotatable ceramic',
            'Light': 'Rolight S with Philips LEDs (infrared control)',
            'Water': 'Constant temp warm water + independent disinfectant supply',
            'Upholstery': 'PU or Microfiber Leather',
            'Delivery Options': 'Over-the-Patient, Cart-Mounted',
            'Warranty': '2 years (1st year parts + service, 2nd year service)',
            'Origin': 'Foshan Roson Medical, China',
        },
        images: ['/images/products/sunlit/chair_n2_blue_sunlight.png'],
        configuratorEnabled: false,
    },
    {
        slug: 'roson-dxn2plus',
        name: 'Roson Classic Model N2 Plus',
        category: 'chair',
        badge: null,
        tagline: 'Everything You Need. Nothing You Don\'t.',
        shortDesc: 'The most complete standard configuration in the N-series — 8-Tooth Smile Philips LED light, ceramic spittoon, 5-position handpiece holder, 5-in-1 tissue box, LED X-ray viewer, and dual water bottles included.',
        description: 'The N2+ is the most fully-loaded standard configuration in the N-series. Out of the box, you get: 8-Tooth Smile Oral Light with Philips LEDs, 180° rotatable ceramic spittoon, 5-position handpiece holder, 5-in-1 tissue box, LED X-ray viewer, dual pure water bottles, constant temperature warm water, and a doctor stool with integrated armrest and backrest. For startup clinics, this is the foundation that has everything — no upgrades needed.',
        features: [
            '8-Tooth Smile Oral Light with Philips LEDs (double mode, infrared on/off)',
            '180° rotatable ceramic spittoon — premium hygiene standard',
            '5-position handpiece holder for organized instrument access',
            '5-in-1 multifunctional tissue box built in',
            'LED X-ray viewer for instant diagnostic reference',
            'Dual pure water bottles (2× 1L) — no mid-session refills',
            'Constant temperature warm water for handpieces and syringe',
            'Doctor stool with integrated armrest and backrest included',
        ],
        advancedFeatures: [
            {
                title: "Most Complete Standard Config",
                description: "13 components included as standard — tissue box, X-ray viewer, dual water bottles, doctor stool with backrest. Other chairs make these optional upgrades."
            },
            {
                title: "8-Tooth Smile Oral Light",
                description: "Philips LED array with double lighting mode and infrared on/off — wave your hand to switch modes without touching anything."
            },
            {
                title: "Ceramic Spittoon",
                description: "180° rotatable ceramic cuspidor with programmable cup filler and flush timing — more hygienic and durable than plastic."
            },
            {
                title: "Dual Water Bottles",
                description: "Two 1L pure water bottles mean fewer interruptions — enough capacity for a full morning of patients."
            }
        ],
        ergonomicsDeepDive: {
            title: "Classic Reliability, Upgraded",
            subtitle: "Your Growth Partner in Dentistry",
            features: [
                "Doctor stool includes armrest AND backrest — proper support for long procedures",
                "Wide dentist table (650×300mm) keeps instruments organized",
                "All three delivery systems available: over-patient, swing, cart",
                "Multi-articulated headrest adapts to any patient height"
            ]
        },
        specs: {
            'Model': 'N2+',
            'Motor': '24V DC silent electric motor',
            'Dentist Table': '650×300mm',
            'Handpiece Holder': '5-position',
            'Spittoon': '180° rotatable ceramic',
            'Light': '8-Tooth Smile Oral Light (Philips LEDs, infrared)',
            'X-Ray': 'Built-in LED X-ray viewer',
            'Water': 'Dual 1L bottles + constant temp warm water',
            'Upholstery': 'PU, Sewn Microfiber, or Seamless Microfiber Leather',
            'Delivery Options': 'Over-the-Patient, Swing-Mounted, Cart-Mounted',
            'Warranty': '2 years (1st year parts + service, 2nd year service)',
            'Origin': 'Foshan Roson Medical, China',
        },
        images: ['/images/products/sunlit/chair_n2plus_sunlight_1774298446120.png'],
        configuratorEnabled: false,
    },
    {
        slug: 'roson-dxn1',
        name: 'Roson Classic Model N1',
        category: 'chair',
        badge: null,
        tagline: 'The Simplest Setup in the Lineup.',
        shortDesc: 'Entry-level with a rotatable right arm for easy patient access and a "one starter" system for air, water, and electricity — the easiest chair to install and operate.',
        description: 'The N1 is the entry point to the ROSON lineup — and it\'s not a compromise. You still get an 8-Tooth Smile Oral Light with Philips LEDs, 180° rotatable ceramic spittoon, 5-position handpiece holder, constant temperature warm water, and pure water supply. What makes it unique: a rotatable right arm that swings out of the way for easy patient entry/exit, and a "one starter" system that connects air, water, and electricity in a single step. The simplest chair to install, the simplest to operate.',
        features: [
            'Rotatable right arm — swings out for easy patient entry and exit',
            '"One starter" system — connects air, water, and electricity in a single step',
            '8-Tooth Smile Oral Light with Philips LEDs (double mode, infrared on/off)',
            '180° rotatable ceramic spittoon for hygienic, easy cleaning',
            '5-position handpiece holder for organized instrument access',
            'Constant temperature warm water for patient comfort',
            'Pure water supply system — clean water to every handpiece',
            'Multi-articulated headrest + multifunction foot control',
        ],
        advancedFeatures: [
            {
                title: "Rotatable Right Arm",
                description: "The armrest swings completely out of the way — elderly patients, children, and patients with limited mobility can sit down and stand up without obstruction."
            },
            {
                title: "One Starter Simplicity",
                description: "A single connection point for air, water, and electricity. Installation is faster, troubleshooting is simpler, and your technician will thank you."
            },
            {
                title: "8-Tooth Smile Oral Light",
                description: "Same Philips LED light as the N2+ — double mode, infrared on/off. No compromise on visibility just because it's the entry model."
            },
            {
                title: "Ceramic Spittoon Standard",
                description: "180° rotatable ceramic cuspidor — the same hygienic, durable spittoon found across the entire N-series."
            }
        ],
        ergonomicsDeepDive: {
            title: "Simplicity and Stability",
            subtitle: "The Smart Start for New Clinics",
            features: [
                "Rotatable right arm makes patient transfers fast and dignified",
                "One starter reduces installation time and complexity",
                "Multifunction foot control with non-skid design and water rinsing button",
                "Integral stool backrest provides basic but solid dentist support"
            ]
        },
        specs: {
            'Model': 'N1',
            'Motor': '24V DC silent electric motor',
            'Dentist Table': '650×300mm',
            'Handpiece Holder': '5-position',
            'Spittoon': '180° rotatable ceramic',
            'Light': '8-Tooth Smile Oral Light (Philips LEDs, infrared)',
            'Water': 'Pure water supply + constant temp warm water',
            'Unique': 'Rotatable right arm + one starter system',
            'Upholstery': 'PU, Sewn Microfiber, or Seamless Microfiber Leather',
            'Delivery Options': 'Over-the-Patient, Swing-Mounted, Cart-Mounted',
            'Warranty': '2 years (1st year parts + service, 2nd year service)',
            'Origin': 'Foshan Roson Medical, China',
        },
        images: ['/images/products/sunlit/chair_n1_sunlight_1774298467454.png'],
        configuratorEnabled: false,
    },
    {
        slug: 'roson-a1-pro-fashionable',
        name: 'Roson A1 Pro',
        category: 'chair',
        badge: 'New',
        tagline: 'Color, Engineered.',
        shortDesc: 'The first dental unit built for the new generation of dentists. 12 mm carbon-steel frame, 150 kg load, sleep-grade soft start/stop, Rolight S 8-LED tri-mode light, intelligent chair memory, RS-07 stool included.',
        description: 'The A1 Pro is ROSON\'s color-led treatment chair tailor-made for the new generation of dentists. A 12 mm carbon-structural-steel frame and 150 kg patient load anchor the engineering; sleep-grade soft start/stop motion makes every adjustment whisper-quiet; the Rolight S 8-LED tri-mode dental light covers the full oral cavity with hands-free IR control. Three signature colors come pre-styled by ROSON\'s design team — ROSON Blue, Ballet Pink, Mint Green — with twelve silicone leather options and twenty-one PU leather options for full customization. Smart workflow built in: intelligent chair memory, Smart Clean button (5-min spittoon rinse + pipeline flush), 4-position adjustable handpiece holder, spittoon odor trap, and patient self-help cup filling. The RS-07 Professional Dentist Stool — with U-shaped ventilation, 90°-110° backrest, and 300-428 mm seat depth — is included as standard.',
        features: [
            '12 mm premium carbon structural steel frame',
            '150 kg maximum patient load capacity',
            'Sleep-grade soft start/stop motion system',
            'Rolight S 8-LED tri-mode dental light (yellow / white / mixed)',
            'Infrared sensing + manual button light control, removable handle',
            'Intelligent memory chair position (one-touch recall)',
            'Smart Clean button: auto 5-min spittoon rinse + pipeline flush',
            'Cup filling linked to spittoon rinse + patient self-help button',
            '4-position adjustable handpiece holder (storage + 2 grip angles)',
            'Detachable ceramic spittoon with rotary odor trap',
            'Three signature colors: ROSON Blue, Ballet Pink, Mint Green',
            '12 silicone leather + 21 PU leather customization options',
            'Integrated color customization (water box + upholstery + tray)',
            'RS-07 Professional Dentist Stool included as standard',
        ],
        specs: {
            'Frame': '12 mm premium carbon structural steel',
            'Maximum patient load': '150 kg',
            'Motion system': 'Sleep-grade soft start/stop',
            'Operating light': 'Rolight S — 8-LED, tri-mode',
            'Light control': 'Infrared sensing + manual button, removable handle',
            'Memory positions': 'Intelligent one-touch recall',
            'Smart Clean': '5-min spittoon rinse + pipeline flush',
            'Handpiece holder': '4-position adjustable (storage + 2 grip angles)',
            'Spittoon': 'Detachable ceramic with rotary odor trap',
            'Upholstery': 'Soft silicone rubber leather OR medical-grade PU leather',
            'Signature colors': 'ROSON Blue, Ballet Pink, Mint Green',
            'Custom colors': '12 silicone + 21 PU leather options',
            'Dentist stool': 'RS-07 Professional (included standard)',
            'Origin': 'Foshan Roson Medical, China',
            'Warranty': '2 years (1st year parts + service, 2nd year service)',
        },
        images: [
            '/images/products/a1-pro/hero.jpg',
            '/images/products/a1-pro/view-2-headrest.jpg',
            '/images/products/a1-pro/view-3-touchscreen.jpg',
            '/images/products/a1-pro/view-4-instrument-arm.jpg',
            '/images/products/a1-pro/view-5-light.jpg',
            '/images/products/a1-pro/view-6-cart.jpg',
        ],
        heroImage: '/images/products/a1-pro/hero.jpg',
        detailPath: '/a1-pro',
        configuratorEnabled: false,
    },

    // ─── IMAGING ──────────────────────────────────────
    {
        slug: 'mecco-mcray-ii',
        name: 'Mecco MC-Ray II',
        category: 'imaging',
        badge: null,
        tagline: 'Portable Digital Precision',
        shortDesc: 'Digital portable X-ray with precise exposure control and consistent high-quality imaging.',
        description: 'The MC-Ray II puts diagnostic imaging power right in your hand. Lightweight, portable, and precise — it delivers consistent high-quality intraoral radiographs without the bulk of wall-mounted systems. Perfect for clinics that need flexibility or multi-operatory setups.',
        features: [
            'Lightweight portable design',
            'Digital exposure control',
            'Consistent image quality',
            'Quick setup and operation',
            'Safe radiation shielding',
        ],
        specs: { 'Type': 'Portable intraoral X-ray', 'Warranty': '1 year' },
        images: ['/images/products/mcray2/main.jpg', '/images/products/mcray2/img2.jpg', '/images/products/mcray2/img3.jpg'],
        configuratorEnabled: false,
    },
    {
        slug: 'mecco-mc-sensor',
        name: 'Mecco MC Sensor',
        category: 'imaging',
        badge: null,
        tagline: 'Crystal-Clear Digital Diagnostics',
        shortDesc: 'High-resolution intraoral sensor for crystal-clear diagnostic imaging and fast acquisition.',
        description: 'Upgrade your diagnostic workflow with the MC Sensor. High-resolution imaging with near-instant acquisition means less chair time per radiograph and sharper images for more confident diagnoses. Integrates seamlessly with most imaging software.',
        features: [
            'High-resolution imaging sensor',
            'Fast image acquisition',
            'Crystal-clear diagnostic detail',
            'Digital workflow compatible',
            'Easy software integration',
        ],
        specs: { 'Type': 'Digital intraoral sensor', 'Warranty': '1 year' },
        images: ['/images/products/mcsensor/main.jpg', '/images/products/mcsensor/img2.jpg'],
        configuratorEnabled: false,
    },
    {
        slug: 'roson-roray-xray',
        name: 'Roson RoRay Handheld X-Ray',
        category: 'imaging',
        badge: 'Premium',
        tagline: 'Diagnostic clarity. In your hand.',
        shortDesc: 'Handheld portable dental X-ray with 0.4mm ultra-fine focal spot, 100,000-cycle tube validation, and 9% full-coverage lead shielding.',
        description: 'The ROSON RoRay is a handheld portable dental X-ray unit built around a 0.4mm ultra-fine focal spot — the same diagnostic-clarity tier as the Nomad Pro 2 and Genoray Port-X III. Independently validated to 100,000 exposure cycles (≈20 years at standard clinic volume) with less than 5% sharpness attenuation across the tube’s lifespan. ROSON’s Double-Protection design wraps the tube head in 9% full-coverage lead shielding combined with a solid-state potting-encapsulated assembly, dropping leakage radiation below standard requirements. Onboard 2.8″ HD color display means no tablet companion. Self-cooling tube. 50,000+ images per battery cycle. Pairs with the ROSON Rosensor for a complete digital radiography kit from a single brand.',
        features: [
            '0.4 mm ultra-fine focal spot (matches Nomad Pro 2, Port-X III)',
            '100,000-cycle tube endurance (validated)',
            'Less than 5% sharpness attenuation over lifespan',
            '9% full-coverage lead shielding (Double Protection)',
            '50,000+ images per battery cycle',
            '2.8-inch HD color onboard display — no tablet required',
            'Self-cooling — no warm-up, no cooldown between exposures',
            'Pairs with ROSON Rosensor for complete digital kit',
        ],
        specs: {
            'Form factor': 'Handheld / Portable',
            'Focal spot': '0.4 mm (Ultra-Fine)',
            'Tube technology': 'High-frequency, solid-state potting-encapsulated',
            'Tube endurance': '100,000+ exposure cycles',
            'Sharpness retention': '<5% attenuation over lifespan',
            'Battery capacity': '50,000+ images per cycle',
            'Display': '2.8-inch HD color',
            'Lead shielding': '9% full-coverage',
            'Cooling': 'Self-cooling',
            'Origin': 'ROSON Medical, China',
            'Warranty': '1 year',
        },
        images: ['/images/products/roray/hero.jpg', '/images/products/roray/view-2.jpg', '/images/products/roray/view-3.jpg', '/images/products/roray/view-4.jpg', '/images/products/roray/view-5.jpg', '/images/products/roray/view-6.jpg'],
        heroImage: '/images/products/roray/hero.jpg',
        detailPath: '/roray-xray',
        configuratorEnabled: false,
    },
    {
        slug: 'digital-shade-guide',
        name: 'Digital Shade Guide',
        category: 'imaging',
        badge: null,
        tagline: 'Accurate Color Every Time',
        shortDesc: 'Digital shade matching for precise, consistent color selection in restorative work.',
        description: 'Stop second-guessing shade matches. The Digital Shade Guide uses digital color analysis to deliver precise, repeatable shade selection — so your restorations match the first time, every time. Patients notice the difference.',
        features: [
            'Digital color analysis technology',
            'Precise shade matching',
            'Consistent repeatable results',
            'Intuitive operation',
            'Compact portable design',
        ],
        specs: { 'Type': 'Digital shade matching device', 'Warranty': '1 year' },
        images: ['/images/products/shade/main.jpg'],
        configuratorEnabled: false,
    },

    // ─── ENDODONTICS ──────────────────────────────────
    {
        slug: 'mecco-endo-star-s',
        name: 'Mecco Endo Star S',
        category: 'endo',
        badge: 'Popular',
        tagline: 'Dual-Mode Endodontic Precision',
        shortDesc: 'Advanced endo motor with reciprocating and rotary modes for efficient root canal treatment.',
        description: 'The Endo Star S gives you the flexibility to work the way you prefer — reciprocating or rotary, switchable on the fly. Precise torque control, intuitive settings, and cordless convenience make root canal procedures faster and more predictable.',
        features: [
            'Dual-mode: reciprocating and rotary',
            'Precise torque control',
            'Intuitive digital controls',
            'Cordless operation',
            'Long battery life',
        ],
        specs: { 'Type': 'Endodontic motor', 'Modes': 'Reciprocating + Rotary', 'Warranty': '1 year' },
        images: ['/images/products/endostars/main.jpg', '/images/products/endostars/img2.jpg', '/images/products/endostars/img3.jpg', '/images/products/endostars/img4.jpg'],
        configuratorEnabled: false,
    },
    {
        slug: 'mecco-apex-locator-a7',
        name: 'Mecco Apex Locator A7',
        category: 'endo',
        badge: null,
        tagline: 'Confident Working Length Determination',
        shortDesc: 'Precision apex locator for accurate working length with clear display and reliable readings.',
        description: 'Accurate working length determination is the foundation of successful endodontics. The A7 uses multi-frequency technology for reliable readings even in challenging canal conditions. The clear LCD display and audio alerts keep you informed without breaking your focus.',
        features: [
            'Multi-frequency measurement technology',
            'High-accuracy readings',
            'Clear LCD display',
            'Audio and visual alerts',
            'Compact, lightweight design',
        ],
        specs: { 'Type': 'Electronic apex locator', 'Warranty': '1 year' },
        images: ['/images/products/apexa7/main.jpg', '/images/products/apexa7/img2.jpg', '/images/products/apexa7/img3.jpg'],
        configuratorEnabled: false,
    },
    {
        slug: 'mecco-apex-locator-r7',
        name: 'Mecco Apex Locator R7',
        category: 'endo',
        badge: null,
        tagline: 'Enhanced Accuracy for Precision Endodontics',
        shortDesc: 'Advanced apex locator with enhanced accuracy and user-friendly interface for precision endo.',
        description: 'The R7 takes apex location accuracy a step further with an enhanced measurement algorithm and a friendlier interface. Perfect for clinicians who do high-volume endo and need readings they can trust every single time.',
        features: [
            'Enhanced measurement accuracy',
            'User-friendly interface',
            'Reliable in all canal conditions',
            'Visual indicator system',
            'Lightweight, portable',
        ],
        specs: { 'Type': 'Electronic apex locator', 'Warranty': '1 year' },
        images: ['/images/products/apexr7/main.jpg', '/images/products/apexr7/img2.jpg'],
        configuratorEnabled: false,
    },
    {
        slug: 'mecco-pulp-tester',
        name: 'Mecco P&C Pulp Tester',
        category: 'endo',
        badge: null,
        tagline: 'Essential Vitality Diagnostics',
        shortDesc: 'Quick and accurate pulp vitality testing. Essential diagnostic tool for every practice.',
        description: 'Every diagnostic toolkit needs a reliable pulp tester. The P&C delivers quick, accurate vitality readings with simple one-button operation. Battery-powered and pocket-sized — it\'s always ready when you need it.',
        features: [
            'Quick vitality diagnosis',
            'Accurate digital readings',
            'Simple one-button operation',
            'Compact pocket-sized design',
            'Battery powered',
        ],
        specs: { 'Type': 'Electric pulp tester', 'Warranty': '1 year' },
        images: ['/images/products/pc/main.jpg', '/images/products/pc/img2.jpg'],
        configuratorEnabled: false,
    },

    // ─── CURING & FILLING ─────────────────────────────
    {
        slug: 'mecco-q9-curing-light',
        name: 'Mecco Q9 Curing Light',
        category: 'curing',
        badge: 'Best Seller',
        tagline: 'Maximum Power, Minimum Cure Time',
        shortDesc: 'High-performance LED curing up to 3000mW/cm². Eight models for diverse clinical needs.',
        description: 'The Q9 is our best-selling curing light for a reason — up to 3000mW/cm² of light intensity means faster, more complete polymerization. Multiple curing modes adapt to different materials, and the cordless design gives you complete freedom of movement. Eight models available to match your specific clinical workflow.',
        features: [
            'Up to 3000mW/cm² light intensity',
            'Multiple curing modes',
            'Cordless freedom',
            'Long battery life',
            'Lightweight ergonomic design',
        ],
        specs: { 'Type': 'LED curing light', 'Max Output': '3000mW/cm²', 'Models': '8 variants available', 'Warranty': '1 year' },
        images: ['/images/products/q9/main.jpg', '/images/products/q9/img2.jpg', '/images/products/q9/img3.jpg', '/images/products/q9/img4.jpg'],
        configuratorEnabled: false,
    },
    {
        slug: 'mecco-q7-curing-light',
        name: 'Mecco Q7 Curing Light',
        category: 'curing',
        badge: null,
        tagline: 'Reliable Daily Curing',
        shortDesc: 'Reliable LED curing with consistent output for dependable daily restorative work.',
        description: 'The Q7 offers excellent curing performance at a value price point. Consistent light output, reliable build quality, and straightforward operation make it the smart choice for practices that need dependable curing every day without premium pricing.',
        features: [
            'Consistent light output',
            'Reliable daily performance',
            'Easy operation',
            'Compact design',
            'Outstanding value',
        ],
        specs: { 'Type': 'LED curing light', 'Warranty': '1 year' },
        images: ['/images/products/q7/main.jpg', '/images/products/q7/img2.jpg', '/images/products/q7/img3.jpg'],
        configuratorEnabled: false,
    },
    {
        slug: 'mecco-smart-fill-e',
        name: 'Mecco Smart Fill-E',
        category: 'curing',
        badge: null,
        tagline: 'Smart Obturation System',
        shortDesc: 'Smart obturation system with precise temperature control for efficient endodontic filling.',
        description: 'The Smart Fill-E takes the guesswork out of obturation. Precise digital temperature control ensures consistent gutta-percha flow, while the ergonomic handpiece keeps you comfortable during extended procedures.',
        features: [
            'Precise digital temperature control',
            'Ergonomic handpiece design',
            'Quick heating element',
            'Digital display',
            'Multiple tip options',
        ],
        specs: { 'Type': 'Obturation system', 'Warranty': '1 year' },
        images: ['/images/products/sfille/main.jpg', '/images/products/sfille/img2.jpg', '/images/products/sfille/img3.jpg'],
        configuratorEnabled: false,
    },
    {
        slug: 'mecco-smart-fill-g',
        name: 'Mecco Smart Fill-G',
        category: 'curing',
        badge: null,
        tagline: 'Precision Gutta-Percha Delivery',
        shortDesc: 'Gutta-percha pen for precise warm vertical condensation in root canal obturation.',
        description: 'Purpose-built for warm vertical condensation, the Smart Fill-G delivers gutta-percha with precision and control. Slim pen-style design for easy maneuverability, fast heating for minimal wait time.',
        features: [
            'Warm vertical condensation',
            'Precise gutta-percha delivery',
            'Fast heating element',
            'Cordless option available',
            'Ergonomic pen grip',
        ],
        specs: { 'Type': 'Obturation pen', 'Warranty': '1 year' },
        images: ['/images/products/sfillg/main.jpg', '/images/products/sfillg/img2.jpg', '/images/products/sfillg/img3.jpg'],
        configuratorEnabled: false,
    },
    {
        slug: 'mecco-smart-fill-p',
        name: 'Mecco Smart Fill-P',
        category: 'curing',
        badge: null,
        tagline: 'Complete Professional Obturation',
        shortDesc: 'Advanced obturation system combining precision, speed, and ease in a professional package.',
        description: 'The Smart Fill-P is the complete obturation solution — combining precision delivery, fast operation, and professional-grade construction in one package. When you want the full fillingsystem without juggling multiple devices.',
        features: [
            'Complete filling system',
            'Professional-grade build',
            'Fast operation',
            'Precision control',
            'Easy cleanup',
        ],
        specs: { 'Type': 'Complete obturation system', 'Warranty': '1 year' },
        images: ['/images/products/sfillp/main.jpg', '/images/products/sfillp/img2.jpg', '/images/products/sfillp/img3.jpg'],
        configuratorEnabled: false,
    },

    // ─── STERILIZATION ────────────────────────────────
    {
        slug: 'easyclave-autoclave',
        name: 'EasyClave Autoclave',
        category: 'sterilization',
        badge: null,
        tagline: 'Compact, Reliable Sterilization',
        shortDesc: 'Reliable tabletop sterilization. Compact, efficient, and perfect for any clinic setup.',
        description: 'Infection control is non-negotiable, and the EasyClave makes it simple. This compact tabletop autoclave runs efficient sterilization cycles with digital temperature monitoring. Small enough for any sterilization area, reliable enough for every workday.',
        features: [
            'Efficient sterilization cycles',
            'Compact tabletop footprint',
            'Digital temperature display',
            'Easy one-button operation',
            'Reliable consistent performance',
        ],
        specs: { 'Type': 'Tabletop autoclave', 'Warranty': '1 year' },
        images: ['/images/products/autoclave/main.jpg', '/images/products/autoclave/img2.jpg'],
        configuratorEnabled: false,
    },

    // ─── ACCESSORIES ──────────────────────────────────
    {
        slug: 'dental-cabinet',
        name: 'Dental Cabinet',
        category: 'accessories',
        badge: null,
        tagline: 'Professional Operatory Storage',
        shortDesc: 'Professional storage with smooth drawers and durable construction for a tidy operatory.',
        description: 'A well-organized operatory runs more efficiently. This dental cabinet provides smooth, quiet drawer action and durable construction that holds up to daily clinical use. Clean, professional aesthetics that complement any chair setup.',
        features: [
            'Organized multi-drawer storage',
            'Smooth quiet drawer action',
            'Durable clinical-grade construction',
            'Clean professional aesthetics',
            'Mobile-ready with locking casters',
        ],
        specs: { 'Type': 'Dental storage cabinet', 'Warranty': '1 year' },
        images: ['/images/products/cabinet/main.png'],
        configuratorEnabled: false,
    },
    {
        slug: 'mobile-trolley',
        name: 'Mobile Trolley',
        category: 'accessories',
        badge: null,
        tagline: 'Versatile In-Clinic Transport',
        shortDesc: 'Versatile mobile trolley with smooth casters for convenient in-clinic equipment transport.',
        description: 'Move equipment, instruments, and supplies wherever they\'re needed with this versatile mobile trolley. Smooth-rolling casters, multiple shelf levels, and a compact footprint make it indispensable for busy practices.',
        features: [
            'Smooth-rolling casters',
            'Multiple shelf levels',
            'Compact footprint',
            'Versatile utility design',
            'Easy to clean surfaces',
        ],
        specs: { 'Type': 'Mobile utility trolley', 'Warranty': '1 year' },
        images: ['/images/products/trolley/main.webp'],
        configuratorEnabled: false,
    },
    {
        slug: 'roson-air-compressor',
        name: 'Roson Air Compressor',
        category: 'accessories',
        badge: null,
        tagline: 'Clean, Quiet Compressed Air',
        shortDesc: 'Quiet, oil-free dental compressor for reliable and clean air supply to your unit.',
        description: 'Every dental unit needs clean, dry compressed air, and the Roson compressor delivers it without the noise. Oil-free operation means no contamination risk, and the quiet motor won\'t disrupt your practice environment.',
        features: [
            'Oil-free operation',
            'Whisper-quiet motor',
            'Reliable clean air supply',
            'Compact footprint',
            'Low maintenance design',
        ],
        specs: { 'Type': 'Oil-free dental compressor', 'Warranty': '1 year' },
        images: ['/images/products/compressor/main.jpg'],
        configuratorEnabled: false,
    },
];

export function getProductBySlug(slug) {
    return products.find(p => p.slug === slug) || null;
}

export function getProductsByCategory(categoryId) {
    if (categoryId === 'all') return products;
    return products.filter(p => p.category === categoryId);
}

export function getRelatedProducts(slug, limit = 4) {
    const product = getProductBySlug(slug);
    if (!product) return [];
    return products
        .filter(p => p.slug !== slug && p.category === product.category)
        .slice(0, limit);
}
