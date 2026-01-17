require('dotenv').config();
const db = require('../config/db');

async function seedNews() {
    try {
        console.log('Seeding news table...');

        const newsItems = [
            {
                title_geo: '2025 წლის წლიური კონფერენცია',
                title_eng: 'Annual Conference 2025 Announced',
                content_geo: '<p>საქართველოს ალერგოლოგიისა და კლინიკური იმუნოლოგიის ასოციაცია აცხადებს 2025 წლის წლიურ კონფერენციას. დეტალები მალე გახდება ცნობილი.</p>',
                content_eng: '<p>The Georgian Association of Allergology and Clinical Immunology announces the Annual Conference for 2025. Details will be available soon.</p>',
                image_url: 'https://placehold.co/600x400?text=Conference+2025'
            },
            {
                title_geo: 'ახალი გაიდლაინები ასთმის მართვაში',
                title_eng: 'New Guidelines for Asthma Management',
                content_geo: '<p>გამოქვეყნდა ასთმის მართვის განახლებული საერთაშორისო გაიდლაინები. იხილეთ სრული დოკუმენტაცია ჩვენს რესურსებში.</p>',
                content_eng: '<p>Updated international guidelines for asthma management have been published. See full documentation in our resources section.</p>',
                image_url: 'https://placehold.co/600x400?text=Asthma+Guidelines'
            },
            {
                title_geo: 'ვორქშოპი პედიატრიულ ალერგიებზე',
                title_eng: 'Workshop on Pediatric Allergies',
                content_geo: '<p>ჩატარდა საინტერესო ვორქშოპი ბავშვთა ალერგოლოგიის აქტუალურ საკითხებზე. მადლობა ყველა მონაწილეს.</p>',
                content_eng: '<p>An interesting workshop on current issues in pediatric allergology was held. Thanks to all participants.</p>',
                image_url: 'https://placehold.co/600x400?text=Pediatric+Workshop'
            },
            {
                title_geo: 'თანამშრომლობა ევროპულ ასოციაციასთან (EAACI)',
                title_eng: 'Collaboration with EAACI',
                content_geo: '<p>ჩვენი ასოციაცია აღრმავებს თანამშრომლობას ევროპის ალერგოლოგიისა და კლინიკური იმუნოლოგიის აკადემიასთან.</p>',
                content_eng: '<p>Our association is deepening its collaboration with the European Academy of Allergy and Clinical Immunology (EAACI).</p>',
                image_url: 'https://placehold.co/600x400?text=EAACI+Collaboration'
            }
        ];

        // Clear existing news to avoid duplicates (optional, but good for seeds)
        // await db.query('TRUNCATE TABLE news'); 

        for (const item of newsItems) {
            await db.query(
                'INSERT INTO news (title_geo, title_eng, content_geo, content_eng, image_url) VALUES (?, ?, ?, ?, ?)',
                [item.title_geo, item.title_eng, item.content_geo, item.content_eng, item.image_url]
            );
        }

        console.log(`Successfully seeded ${newsItems.length} news items.`);
        process.exit(0);
    } catch (err) {
        console.error('Error seeding news:', err);
        process.exit(1);
    }
}

seedNews();
