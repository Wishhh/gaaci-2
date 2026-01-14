USE gaaci_db;

-- Users (Admin) - Pass: androe1998
DELETE FROM users WHERE username = 'agagosha';
INSERT INTO users (username, password_hash) VALUES 
('agagosha', '$2b$10$F2LccmCjpvd/0iPdY3IEnOotQ3oJvUnTi95bMgvLAo.M5Vee3mcda');

-- Clear existing data
DELETE FROM activities;
DELETE FROM events;
DELETE FROM upcoming_events;
DELETE FROM sections;
DELETE FROM about_info;
DELETE FROM contact_info;

-- About Info
INSERT INTO about_info (title_geo, title_eng, content_geo, content_eng) VALUES 
('საკიას შესახებ', 'About GAACI', 
'საქართველოს ალერგოლოგიისა და კლინიკური იმუნოლოგიის ასოციაცია (საკია) არაკომერციული ორგანიზაციაა, რომელიც 1984 წელს, თბილისში დაარსდა. ასოციაცია აერთიანებს წამყვან სპეციალისტებს ალერგოლოგიის, კლინიკური იმუნოლოგიისა და მომიჯნავე სფეროებიდან. ჩვენი მიზანია საქართველოში ამ დარგების განვითარება, საერთაშორისო სტანდარტების დანერგვა და სამეცნიერო თანამშრომლობის გაღრმავება.', 
'The Georgian Association of Allergology and Clinical Immunology (GAACI) is a non-profit organization founded in 1984 in Tbilisi. The association brings together leading specialists in allergology, clinical immunology, and related fields. Our goal is to develop these fields in Georgia, implement international standards, and deepen scientific cooperation.');

-- Sections
INSERT INTO sections (title_geo, title_eng) VALUES 
('ალერგია და ასთმა', 'Allergy and Asthma'),
('ბაზისური იმუნოლოგია', 'Basic Immunology'),
('კლინიკური იმუნოლოგია', 'Clinical Immunology'),
('პედიატრია', 'Pediatrics'),
('ვაქცინაცია', 'Vaccination'),
('დერმატოლოგია', 'Dermatology'),
('ინფექციური დაავადებები', 'Infectious Diseases');

-- Contact Info
INSERT INTO contact_info (phone, email, address_geo, address_eng) VALUES 
('+995 551 11 19 89', 'gaaci2014@gmail.com', 'რუსთაველის გამზ. №104, 4600, ქუთაისი, საქართველო', '104 Rustaveli Ave, 4600, Kutaisi, Georgia');

-- Events
INSERT INTO events (title_geo, title_eng, image_url, event_date, custom_fields) VALUES 
('კონგრესი 2024', 'Congress 2024', 'images/congress1.png', '2024-05-01 10:00:00', 
'[
    {
        "id": "intro",
        "title_geo": "მიმოხილვა",
        "title_eng": "Overview",
        "content_geo": "<p>2024 წლის კონგრესი ფოკუსირებული იყო პერსონალიზებულ მედიცინაზე ალერგოლოგიაში. კონგრესს ესწრებოდა 500-ზე მეტი დელეგატი.</p>",
        "content_eng": "<p>The 2024 Congress focused on personalized medicine in allergology. The congress was attended by over 500 delegates.</p>"
    },
    {
        "id": "speakers",
        "title_geo": "სპიკერები",
        "title_eng": "Speakers",
        "content_geo": "<p>მოწვეული იყვნენ წამყვანი ექსპერტები ევროპიდან და აშშ-დან.</p><ul><li>პროფ. იოჰანეს ჰოლერი</li><li>დოქტ. მარია გარსია</li></ul>",
        "content_eng": "<p>Leading experts from Europe and the USA were invited.</p><ul><li>Prof. Johannes Holler</li><li>Dr. Maria Garcia</li></ul>"
    },
    {
        "id": "program",
        "title_geo": "პროგრამა",
        "title_eng": "Program",
        "content_geo": "<p>სამეცნიერო პროგრამა მოიცავდა პლენარულ სესიებსა და ვორქშოფებს.</p>",
        "content_eng": "<p>The scientific program included plenary sessions and workshops.</p>"
    }
]'),
('ასთმის სკოლა 2023', 'Asthma School 2023', 'images/asthma.jpg', '2023-11-15 14:00:00', 
'[
    {
        "id": "main",
        "title_geo": "პროექტის შესახებ",
        "title_eng": "About the Project",
        "content_geo": "<p>პროექტი მიზნად ისახავდა პაციენტების განათლებას ასთმის მართვის საკითხებში.</p>",
        "content_eng": "<p>The project aimed to educate patients on asthma management issues.</p>"
    },
    {
        "id": "topics",
        "title_geo": "თემები",
        "title_eng": "Topics",
        "content_geo": "<ol><li>ინჰალაციური ტექნიკა</li><li>გამომწვევი ფაქტორების თავიდან აცილება</li></ol>",
        "content_eng": "<ol><li>Inhalation techniques</li><li>Avoiding triggers</li></ol>"
    }
]');

-- Activities
INSERT INTO activities (title_geo, title_eng, image_url, activity_date, custom_fields) VALUES 
('ვორქშოფი იმუნოლოგიაში', 'Workshop in Immunology', 'images/logo.png', '2024-02-10 11:00:00', 
'[
    {
        "id": "details",
        "title_geo": "დეტალები",
        "title_eng": "Details",
        "content_geo": "<p>სასწავლო კურსი ახალგაზრდა მეცნიერებისთვის.</p>",
        "content_eng": "<p>Training course for young scientists.</p>"
    }
]');

-- Upcoming Events
INSERT INTO upcoming_events (title_geo, title_eng, location_geo, location_eng, start_date, end_date, image_url, custom_fields) VALUES 
('კონგრესი 2026', 'Congress 2026', 'თბილისი, რედისონ ბლუ', 'Tbilisi, Radisson Blu', '2026-05-04 09:00:00', '2026-05-07 18:00:00', 'images/upcoming.png',
'[
    {
        "id": "info",
        "title_geo": "ინფორმაცია",
        "title_eng": "Information",
        "content_geo": "<p>რეგისტრაცია დაიწყება 2025 წლის სექტემბერში.</p>",
        "content_eng": "<p>Registration will open in September 2025.</p>"
    }
]');
