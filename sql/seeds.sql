USE gaaci_db;

-- Users (Admin) - Password: admin123
INSERT INTO users (username, password_hash) VALUES 
('agagosha', '$2b$10$F2LccmCjpvd/0iPdY3IEnOotQ3oJvUnTi95bMgvLAo.M5Vee3mcda'); -- User: agagosha, Pass: androe1998

-- Events
INSERT INTO events (title_geo, title_eng, details_geo, details_eng, image_url, event_date) VALUES 
('კონგრესი 2024', 'Congress 2024', 'მხარდაჭერილია შოთა რუსთაველის საქართველოს ეროვნული სამეცნიერო ფონდის მიერ (MG-ISE-23-369) დასრულდა!', 'Supported by Shota Rustaveli National Science Foundation of Georgia (MG-ISE-23-369) - Completed!', 'images/congress1.png', '2024-05-01 10:00:00'),
('კონგრესი 2026', 'Congress 2026', 'საქართველოს ალერგოლოგიისა და კლინიკური იმუნოლოგიის ასოციაციის კონგრესი', 'Georgian Association of Allergology and Clinical Immunology Congress', 'images/congress2.png', '2026-05-07 10:00:00'),
('2024 წლის კონგრესის სპიკერები და მოწვეული ლექტორები', '2024 Congress Speakers and Invited Lecturers', 'საქართველოს ალერგოლოგიისა და კლინიკური იმუნოლოგიის ასოციაციის კონგრესი', 'Georgian Association of Allergology and Clinical Immunology Congress', 'images/congress3.png', '2024-05-01 10:00:00'),
('2024 წლის კონგრესის', '2024 Congress', 'საქართველოს ალერგოლოგიისა და კლინიკური იმუნოლოგიის ასოციაციის კონგრესი', 'Georgian Association of Allergology and Clinical Immunology Congress', 'images/confgress4.jpg', '2024-05-01 10:00:00');

-- Activities (moved from events)
INSERT INTO activities (title_geo, title_eng, details_geo, details_eng, image_url, activity_date) VALUES 
('ასთმის მსოფლიო დღე 2024', 'Asthma World Day 2024', 'საქართველოს ალერგოლოგიისა და კლინიკური იმუნოლოგიის ასოციაციის ღონისძიება', 'Georgian Association of Allergology and Clinical Immunology Event', 'images/asthma.jpg', '2024-05-01 10:00:00');

-- About Info
INSERT INTO about_info (title_geo, title_eng, content_geo, content_eng) VALUES 
('საკიას შესახებ', 'About GAACI', 'საქართველოს ალერგოლოგიისა და კლინიკური იმუნოლოგიის ასოციაცია (საკია) არაკომერციული ორგანიზაციაა, რომელიც 1984 წელს, თბილისში დაარსდა. საკია-ის მთავარი მიზანია სამეცნიერო, სამედიცინო, დიაგნოსტიკური და საპროფილაქტიკო ღონისძიებების მოწყობა, რომელიც მიმართულია ალერგიის, ასთმისა და იმუნოლოგიის სფეროში.', 'The Georgian Association of Allergology and Clinical Immunology (GAACI) is a non-commercial organization founded in 1984 in Tbilisi. GAACI''s main goal is to organize scientific, medical, diagnostic and preventive activities aimed at the field of allergy, asthma and immunology.');

-- Sections
INSERT INTO sections (title_geo, title_eng) VALUES 
('ალერგია და ასთმა', 'Allergy and Asthma'),
('ბაზისური იმუნოლოგია და იმუნობიოტექნოლოგია', 'Basic Immunology and Immunobiotechnology'),
('კლინიკური იმუნოლოგია და იმუნორეაბილიტაცია', 'Clinical Immunology and Immunorehabilitation'),
('პედიატრია', 'Pediatrics'),
('პულმონოლოგიური დაავადებების იმუნოლოგია', 'Pulmonological Disease Immunology'),
('დერმატო-ვენეროლოგია', 'Dermato-venereology'),
('ინფექციური დაავადებების იმუნოლოგია', 'Infectious Disease Immunology'),
('ვაქცინაცია', 'Vaccination');

-- Contact Info
INSERT INTO contact_info (phone, email, address_geo, address_eng) VALUES 
('+ 995 551 11 19 89', 'gaaci2014@gmail.com', 'რუსთაველის გამზ. №104, 4600, ქუთაისი, საქართველო', 'Rustaveli Ave. №104, 4600, Kutaisi, Georgia');

-- Upcoming Event
INSERT INTO upcoming_events (title_geo, title_eng, location_geo, location_eng, start_date, end_date, image_url) VALUES 
('საქართველოს ალერგოლოგიისა და კლინიკური იმუნოლოგიის ასოციაციის კონგრესი 2026', 'Georgian Association of Allergology and Clinical Immunology Congress 2026', 'თბილისი, საქართველო - სასტუმრო რედისონ ბლუ ივერია', 'Tbilisi, Georgia - Radisson Blu Iveria Hotel', '2026-05-04 00:00:00', '2026-05-07 00:00:00', 'images/upcoming.png');
