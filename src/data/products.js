export const categories = [
    { id: 'all', label: 'All Products' },
    { id: 'chair', label: 'Dental Chairs' },
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
        description: 'The Roson Flagship Model A3 (KLT-6220) is the crown jewel of DentaSource Direct. Designed for practices demanding uncompromising clinical standards, it integrates technology once exclusive to the highest-end European units. A built-in Electrolytic Oxidized Water (EOW) system actively neutralizes 99.9999% of waterline bacteria. Workflow is dramatically improved through an intuitive medical-grade color LCD, while dual infrared sensors auto-fill cups hands-free. Patients experience profound comfort on ultra-breathable, pressure-mapping seamless leather, driven by a whisper-quiet Timotion motor.',
        features: [
            'Worry-free waterline safety with EOW disinfection system (eliminates 99.9999% of bacteria)',
            'See every detail with the 8-bead Philips LED sensor light (adjustable color temp)',
            'Intuitive workflow via medical-grade color LCD touchscreen panel',
            'Smart dual-induction water supply auto-fills cup hands-free',
            'Integrated thermostatic water heating system for patient comfort',
            'Anti-collision assistant arm prevents equipment damage or injury',
            'Three customizable memory positions and one-key smart drainage',
            'Built to last: whisper-quiet Timotion motor and SMC polyether pipelines',
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
                description: "Timotion motor system provides buttery-smooth, near-silent adjustments that put anxious patients at ease."
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
            'Motor': 'Timotion (5-year warranty)',
            'Upholstery': 'Breathable seamless microfiber leather (5-year warranty)',
            'Light': 'RoLight 8-bead LED (3-year warranty)',
            'Display': 'Medical-grade color LCD',
            'Disinfection': 'EOW electrolytic oxidized water',
            'Water System': 'Dual IR & gravity sensing',
            'Pipelines': 'SMC Polyether (5-year warranty)',
            'Warranty': '2 years (1st year parts + service, 2nd year service)',
            'Origin': 'Foshan Roson Medical, China',
        },
        images: ['/images/products/dxa3/main.jpg', '/images/products/dxa3/lcd.jpg', '/images/products/dxa3/cuspidor.jpg', '/images/products/dxa3/light.jpg', '/images/products/dxa3/panel.jpg'],
        heroImage: '/images/products/dxa3/main.jpg',
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
            'Jitter-free, ultra-quiet Timotion motor system ensures patient relaxation',
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
                description: "Our soft-start/stop Timotion motor system guarantees butter-smooth transitions. Keep your patients completely relaxed and comfortable."
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
            'Motor': 'Timotion (5-year warranty)',
            'Upholstery': 'Breathable Seamless Microfiber Leather (5-year warranty)',
            'Light': 'RoLight Dental Light (3-year warranty)',
            'Display': 'Medical-grade color LCD',
            'Disinfection': 'EOW electrolytic oxidized water',
            'Pipelines': 'SMC Polyether (5-year warranty)',
            'Warranty': '2 years (1st year parts + service, 2nd year service)',
            'Origin': 'Foshan Roson Medical, China',
        },
        images: ['/images/products/s9/main.jpg'],
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
        tagline: 'Luxury Meets Functionality',
        shortDesc: 'Luxury variant of the A3 series with premium upholstery and enhanced clinical features.',
        description: 'The Fashion Model A3L brings the technology of the A3 platform into a luxury package. Premium PU upholstery, a refined aesthetic, and all the core features that make the A3 series legendary — just configured for clinics that want a premium look at a more accessible price point.',
        features: [
            'A3-platform core technology',
            'Premium PU upholstery',
            'Self-balance position apparatus arm',
            'Anti-collision assistant arm',
            '8-bead LED dental light',
            'Dynamic atmosphere lighting',
        ],
        advancedFeatures: [
            {
                title: "Premium Patient Comfort",
                description: "Experience the perfect balance of luxury and support with our premium PU upholstery, designed to keep patients relaxed during extended procedures."
            },
            {
                title: "Shadowless LED Illumination",
                description: "The 8-bead LED dental light delivers crisp, broad visibility across the entire oral cavity, reducing eye strain and enhancing precision."
            },
            {
                title: "A3-Platform Core",
                description: "Built on the legendary A3 platform technology, delivering uncompromising reliability and butter-smooth articulation."
            },
            {
                title: "Active Collision Prevention",
                description: "Smart sensors in the assistant arm instantly halt movement if an obstruction is detected, safeguarding your staff and equipment."
            }
        ],
        ergonomicsDeepDive: {
            title: "Designed for Clinical Harmony",
            subtitle: "Your Growth Partner in Dentistry",
            features: [
                "Self-balancing position apparatus arm for effortless maneuverability",
                "Dynamic atmosphere lighting sets a calming mood for anxious patients",
                "Streamlined assistant module maximizes your workspace efficiency",
                "Built to support natural posture for both dentist and assistant"
            ]
        },
        specs: {
            'Motor': 'Timotion',
            'Upholstery': 'PU leather',
            'Light': '8-bead LED (RV008-1)',
            'Warranty': '2 years',
            'Origin': 'Foshan Roson Medical, China',
        },
        images: ['/images/products/dxa3l/main.jpg', '/images/products/dxa3l/detail.jpg', '/images/products/dxa3l/equipment.jpg'],
        configuratorEnabled: false,
    },
    {
        slug: 'roson-dxa3s',
        name: 'Roson Smart Model A3S',
        category: 'chair',
        badge: null,
        tagline: 'Smart Design for Compact Spaces',
        shortDesc: 'Compact smart design optimized for smaller clinic spaces without compromising performance.',
        description: 'Not every clinic has a sprawling operatory, and the Smart Model A3S was designed exactly for that reality. It packs A3-series performance into a compact footprint — perfect for startup clinics, condo-based practices, or multi-chair setups where every square meter counts. Zero compromises on clinical capability.',
        features: [
            'Space-optimized compact footprint',
            'Full A3-series functionality',
            'Smart integrated controls',
            'Complete delivery system',
            'Efficient workflow design',
        ],
        advancedFeatures: [
            {
                title: "Intelligent Space Optimization",
                description: "Engineered specifically for compact operatories, the A3S maximizes your available space without sacrificing a single clinical feature."
            },
            {
                title: "A3-Series Performance",
                description: "Enjoy the exact same robust performance and reliability found in our flagship models, perfectly scaled for your clinic's needs."
            },
            {
                title: "Smart Command Integration",
                description: "Manage your entire workflow effortlessly with intuitive smart controls that put essential functions right at your fingertips."
            },
            {
                title: "Streamlined Delivery",
                description: "A complete, highly efficient delivery system ensures every instrument is exactly where you need it, exactly when you need it."
            }
        ],
        ergonomicsDeepDive: {
            title: "Compact Without Compromise",
            subtitle: "Your Growth Partner in Dentistry",
            features: [
                "Minimized footprint opens up movement pathways in smaller clinics",
                "Carefully calibrated articulation provides full access without bumping walls",
                "Ergonomic instrument positioning reduces repetitive strain",
                "Ideal for multi-chair setups and high-efficiency hygiene bays"
            ]
        },
        specs: {
            'Motor': 'Timotion',
            'Upholstery': 'PU leather',
            'Warranty': '2 years',
            'Origin': 'Foshan Roson Medical, China',
        },
        images: ['/images/products/dxa3s/main.jpg'],
        configuratorEnabled: false,
    },
    {
        slug: 'roson-dxs3',
        name: 'Roson Hot-Selling Model S3',
        category: 'chair',
        badge: 'Popular',
        tagline: 'Dependable Everyday Performance',
        shortDesc: 'Sturdy mid-range chair with reliable operation built for dependable everyday performance.',
        description: 'The Hot-Selling Model S3 is built for clinics that value reliability above all else. Sturdy construction, smooth operation, and all the essential features you need — nothing you don\'t. It\'s the chair that shows up every day and just works, year after year.',
        features: [
            'Heavy-duty sturdy construction',
            'Reliable motor operation',
            'Complete delivery unit',
            'Standard LED operating light',
            'Easy maintenance design',
        ],
        advancedFeatures: [
            {
                title: "Unshakable Reliability",
                description: "Constructed with heavy-duty materials to withstand the rigorous demands of high-volume, every-day clinical use."
            },
            {
                title: "Consistent Performance",
                description: "Driven by a highly dependable motor system that ensures smooth, jitter-free operation appointment after appointment."
            },
            {
                title: "Essential Delivery System",
                description: "A streamlined, complete delivery unit that provides all the essential tools you need without unnecessary complexity."
            },
            {
                title: "Clear Illumination",
                description: "Standard LED operating light provides bright, focused illumination exactly where you need it for accurate diagnostics and treatment."
            }
        ],
        ergonomicsDeepDive: {
            title: "Built for the Daily Grind",
            subtitle: "Your Growth Partner in Dentistry",
            features: [
                "Straightforward, intuitive controls reduce training time for new staff",
                "Easy-maintenance design minimizes downtime and keeps your clinic running",
                "Sturdy patient support accommodates diverse body types comfortably",
                "Practical layout keeps essential instruments within easy reach"
            ]
        },
        specs: {
            'Motor': 'Timotion',
            'Upholstery': 'PU leather',
            'Warranty': '2 years',
            'Origin': 'Foshan Roson Medical, China',
        },
        images: ['/images/products/dxs3/main.jpg'],
        configuratorEnabled: false,
    },
    {
        slug: 'roson-dxs6',
        name: 'Roson Professional Model S6',
        category: 'chair',
        badge: null,
        tagline: 'Where Style Meets Clinical Excellence',
        shortDesc: 'Premium S-series with refined aesthetics, blending style and clinical excellence.',
        description: 'The Professional Model S6 is for the dentist who believes their equipment should look as professional as their work. Refined aesthetics, premium build quality, and advanced positioning — it makes a statement the moment a patient walks into your operatory.',
        features: [
            'Premium build quality',
            'Advanced positioning system',
            'Fully integrated systems',
            'Refined modern aesthetics',
            'Clinical-grade performance',
        ],
        advancedFeatures: [
            {
                title: "Breathtaking Modern Aesthetics",
                description: "Make an unforgettable statement with refined, stylish lines that elevate the perceived value of your entire practice."
            },
            {
                title: "Premium Construction",
                description: "Built with meticulously selected materials that not only look spectacular but are engineered for lasting clinical-grade durability."
            },
            {
                title: "Advanced Articulation",
                description: "Experience fluid, precise patient positioning that allows for optimal access to the oral cavity from any angle."
            },
            {
                title: "Seamless Integration",
                description: "Every system, from water delivery to suction, is seamlessly integrated to create a tidy, highly professional operatory environment."
            }
        ],
        ergonomicsDeepDive: {
            title: "Where Style Meets Comfort",
            subtitle: "Your Growth Partner in Dentistry",
            features: [
                "Luxurious upholstery provides exceptional support during long restorative sessions",
                "Optimized practitioner positioning prevents back and neck fatigue",
                "Clean lines and hidden cabling reduce visual clutter and anxiety",
                "Intuitive interface allows you to focus purely on your clinical work"
            ]
        },
        specs: {
            'Motor': 'Timotion',
            'Upholstery': 'Premium PU',
            'Warranty': '2 years',
            'Origin': 'Foshan Roson Medical, China',
        },
        images: ['/images/products/dxs6/main.jpg'],
        configuratorEnabled: false,
    },
    {
        slug: 'roson-dxn2-pro',
        name: 'Roson Elite Model N2 PRO',
        category: 'chair',
        badge: null,
        tagline: 'The Ultimate Modern Operatory Chair',
        shortDesc: 'Premium model with advanced ergonomics, integrated LED light, and full delivery system for modern practices.',
        description: 'The Roson Elite Model N2 PRO represents the pinnacle of dental chair engineering. Designed for the modern practice that demands nothing less than excellence, it combines advanced ergonomic patient positioning with a comprehensive delivery system. Every detail — from the whisper-quiet motor to the memory-position controls — is built to let you focus entirely on your patient.',
        features: [
            'Ergonomic patient positioning with memory settings',
            'Integrated LED sensor operating light',
            'Multi-position memory for quick adjustments',
            'Built-in assistant module with suction',
            'Premium leather upholstery in multiple colors',
            'Whisper-quiet Timotion motor system',
        ],
        advancedFeatures: [
            {
                title: "80,000+ Dentists' Choice",
                description: "Join a global community of practitioners who trust the N-series platform for its unparalleled daily reliability and performance."
            },
            {
                title: "Intelligent Soft Start/Stop",
                description: "The advanced motor system ensures the dental chair starts and stops smoothly without any jerkiness, keeping your patient relaxed."
            },
            {
                title: "Medical-Grade Color LCD",
                description: "Manage your entire workflow effortlessly with the integrated, highly intuitive medical-grade color touchscreen display."
            },
            {
                title: "Durable and Easy-to-Clean",
                description: "Constructed with premium, stain-resistant materials designed to withstand the rigors of high-volume clinical sanitization."
            }
        ],
        ergonomicsDeepDive: {
            title: "Advanced Iteration Continuation",
            subtitle: "Your Growth Partner in Dentistry",
            features: [
                "Seamless integration of delivery and suction systems minimizes reaching",
                "Exceptional patient lumbar support for extended restorative procedures",
                "Fully customizable positioning accommodates your preferred working posture",
                "Detachable suction filter and smart drainage simplify daily maintenance"
            ]
        },
        specs: {
            'Motor': 'Timotion (5-year warranty)',
            'Upholstery': 'Premium microfiber leather',
            'Light': '8-bead LED with adjustable color temp',
            'Warranty': '2 years (1st year parts + service)',
            'Origin': 'Foshan Roson Medical, China',
        },
        images: ['/images/products/dxn2pro/main.jpg'],
        configuratorEnabled: false,
    },
    {
        slug: 'roson-dxn2plus',
        name: 'Roson Classic Model N2 Plus',
        category: 'chair',
        badge: null,
        tagline: 'Upgraded Classic Performance',
        shortDesc: 'Upgraded iteration of our classic N2 series with enhanced ergonomic comfort and a highly reliable core.',
        description: 'The Classic Model N2 Plus builds upon the legendary reliability of our classic N-series platform. It provides upgraded ergonomic patient comfort and features a refined delivery unit designed for high-volume practices that require both longevity and seamless workflow.',
        features: [
            'Upgraded ergonomic patient cushioning',
            'Refined delivery unit workflow',
            'Reliable core platform',
            'Integrated operating light',
            'Multiple memory configurations',
        ],
        advancedFeatures: [
            {
                title: "Enhanced Patient Comfort",
                description: "Upgraded ergonomic cushioning contours to the patient's body, significantly reducing anxiety and restlessness during procedures."
            },
            {
                title: "Legendary N-Series Reliability",
                description: "Built upon our proven classic platform, the N2 Plus delivers the unyielding reliability high-volume clinics depend on."
            },
            {
                title: "Refined Workflow",
                description: "An optimized delivery unit layout minimizes unnecessary reaching, keeping your instruments perfectly positioned for efficiency."
            },
            {
                title: "Rapid Memory Recall",
                description: "Multiple programmable memory settings allow you to instantly transition the chair back to your preferred working positions."
            }
        ],
        ergonomicsDeepDive: {
            title: "Classic Reliability, Upgraded",
            subtitle: "Your Growth Partner in Dentistry",
            features: [
                "Generous cushioning provides superior lumbar support for patients",
                "Smooth articulation ensures gentle transitions between supine and upright",
                "Integrated operating light is effortlessly positioned with one hand",
                "Highly resilient upholstery withstands aggressive daily sanitization"
            ]
        },
        specs: {
            'Motor': 'Timotion',
            'Upholstery': 'PU or Microfiber Leather options',
            'Warranty': '2 years',
            'Origin': 'Foshan Roson Medical, China',
        },
        images: ['/images/products/dxn2plus/main.jpg'],
        configuratorEnabled: false,
    },
    {
        slug: 'roson-dxn1',
        name: 'Roson Classic Model N1',
        category: 'chair',
        badge: null,
        tagline: 'Reliable Mid-Range Performance',
        shortDesc: 'Versatile mid-range chair with hydraulic lift and complete delivery system for everyday clinical use.',
        description: 'The Classic Model N1 is the workhorse of the Roson lineup. Built for clinics that need reliable, full-featured equipment without the flagship price tag. Its lift system provides smooth, stable positioning, while the complete delivery unit keeps every tool within reach. A smart choice for startup clinics and expanding practices alike.',
        features: [
            'Smooth lifting system for patient positioning',
            'Integrated delivery unit with handpieces',
            'LED operating light',
            'Comfortable patient cushioning',
            'Easy maintenance design',
        ],
        advancedFeatures: [
            {
                title: "Rock-Solid Foundation",
                description: "A robust hydraulic-style lifting system provides smooth, incredibly stable patient positioning without any shaking or jarring."
            },
            {
                title: "Comprehensive Delivery",
                description: "Features a fully integrated delivery unit equipped with everything needed for everyday clinical diagnostics and treatment."
            },
            {
                title: "Clear, Cool LED Light",
                description: "The integrated LED operating light delivers a cool, focused beam that illuminates the oral cavity without overheating the patient."
            },
            {
                title: "Accessible Maintenance",
                description: "Engineered with simplicity in mind, allowing for quick, easy routine maintenance to keep your operatory running without interruption."
            }
        ],
        ergonomicsDeepDive: {
            title: "Simplicity and Stability",
            subtitle: "Your Growth Partner in Dentistry",
            features: [
                "Uncomplicated operation allows you to focus purely on dentistry",
                "Stable base prevents any shifting during precise restorative work",
                "Comfortable patient cushioning accommodates long appointments",
                "Clean, accessible surfaces make between-patient teardown incredibly fast"
            ]
        },
        specs: {
            'Motor': 'Timotion',
            'Upholstery': 'PU leather',
            'Light': 'LED operating light',
            'Warranty': '2 years',
            'Origin': 'Foshan Roson Medical, China',
        },
        images: ['/images/products/dxn1/main.jpg'],
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
        name: 'Roson Roray X-Ray',
        category: 'imaging',
        badge: null,
        tagline: 'Reliable Wall-Mounted Imaging',
        shortDesc: 'Wall-mounted X-ray unit with reliable performance for everyday diagnostic needs.',
        description: 'The Roray is the reliable workhorse of intraoral imaging — a wall-mounted unit that delivers consistent exposure after exposure. Set it up once, and it\'ll serve your practice for years with minimal maintenance.',
        features: [
            'Wall-mounted space-saving design',
            'Reliable consistent imaging',
            'Precise exposure settings',
            'Easy daily operation',
            'Durable long-life build',
        ],
        specs: { 'Type': 'Wall-mounted intraoral X-ray', 'Mount': 'Wall', 'Warranty': '1 year' },
        images: ['/images/products/roray/main.jpg', '/images/products/roray/img2.jpg', '/images/products/roray/img3.jpg'],
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
