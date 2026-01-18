-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 18, 2026 at 08:18 PM
-- Server version: 10.4.24-MariaDB
-- PHP Version: 8.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `gaaci_db`
--
use defaultdb;
-- --------------------------------------------------------

--
-- Table structure for table `about_info`
--

DROP TABLE IF EXISTS `about_info`;
CREATE TABLE `about_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `title_geo` varchar(255) DEFAULT NULL,
  `title_eng` varchar(255) DEFAULT NULL,
  `content_geo` text DEFAULT NULL,
  `content_eng` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `about_info`
--

INSERT INTO `about_info` (`id`, `title_geo`, `title_eng`, `content_geo`, `content_eng`) VALUES
(7, 'საკიას შესახებ', 'About GAACI', 'საქართველოს ალერგოლოგიისა და კლინიკური იმუნოლოგიის ასოციაცია (საკია) არაკომერციული ორგანიზაციაა, რომელიც 1984 წელს, თბილისში დაარსდა. ასოციაცია აერთიანებს წამყვან სპეციალისტებს ალერგოლოგიის, კლინიკური იმუნოლოგიისა და მომიჯნავე სფეროებიდან. ჩვენი მიზანია საქართველოში ამ დარგების განვითარება, საერთაშორისო სტანდარტების დანერგვა და სამეცნიერო თანამშრომლობის გაღრმავება.', 'The Georgian Association of Allergology and Clinical Immunology (GAACI) is a non-profit organization founded in 1984 in Tbilisi. The association brings together leading specialists in allergology, clinical immunology, and related fields. Our goal is to develop these fields in Georgia, implement international standards, and deepen scientific cooperation.');

-- --------------------------------------------------------

--
-- Table structure for table `activities`
--

DROP TABLE IF EXISTS `activities`;
CREATE TABLE `activities` (
  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `title_geo` varchar(255) NOT NULL,
  `title_eng` varchar(255) NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `activity_date` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `custom_fields` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`custom_fields`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `activities`
--

INSERT INTO `activities` (`id`, `title_geo`, `title_eng`, `image_url`, `activity_date`, `created_at`, `custom_fields`) VALUES
(14, 'ვორქშოფი იმუნოლოგიაში', 'Workshop in Immunology', 'images/logo.png', '2024-02-10 11:00:00', '2026-01-14 14:36:16', '[\r\n    {\r\n        \"id\": \"details\",\r\n        \"title_geo\": \"დეტალები\",\r\n        \"title_eng\": \"Details\",\r\n        \"content_geo\": \"<p>სასწავლო კურსი ახალგაზრდა მეცნიერებისთვის.</p>\",\r\n        \"content_eng\": \"<p>Training course for young scientists.</p>\"\r\n    }\r\n]'),
(15, 'პედიატრიული ალერგიის ვორქშოფი', 'Pediatric Allergy Workshop', 'images/allergy_workshop.png', '2025-06-15 11:00:00', '2026-01-14 14:36:16', '[\r\n    {\r\n        \"id\": \"training\",\r\n        \"title_geo\": \"ტრენინგი\",\r\n        \"title_eng\": \"Training\",\r\n        \"content_geo\": \"<div style=\'display: flex; gap: 20px; align-items: center;\'><img src=\'images/allergy_workshop.png\' style=\'width: 150px; height: 150px; border-radius: 50%; object-fit: cover;\'><p>სპეციალიზებული ტრენინგი პედიატრებისთვის.</p></div>\",\r\n        \"content_eng\": \"<div style=\'display: flex; gap: 20px; align-items: center;\'><img src=\'images/allergy_workshop.png\' style=\'width: 150px; height: 150px; border-radius: 50%; object-fit: cover;\'><p>Specialized training for pediatricians.</p></div>\"\r\n    },\r\n    {\r\n        \"id\": \"faculty\",\r\n        \"title_geo\": \"ფაკულტეტი\",\r\n        \"title_eng\": \"Faculty\",\r\n        \"content_geo\": \"<div style=\'display: flex; flex-wrap: wrap; gap: 10px;\'><span style=\'background: #0055aa; padding: 5px 10px; border-radius: 15px;\'>დოქტ. მაია გოგიჩაიშვილი</span><span style=\'background: #008855; padding: 5px 10px; border-radius: 15px;\'>დოქტ. თამარ კვარაცხელია</span></div>\",\r\n        \"content_eng\": \"<div style=\'display: flex; flex-wrap: wrap; gap: 10px;\'><span style=\'background: #0055aa; padding: 5px 10px; border-radius: 15px;\'>Dr. Maia Gogichaishvili</span><span style=\'background: #008855; padding: 5px 10px; border-radius: 15px;\'>Dr. Tamar Kvaratskhelia</span></div>\"\r\n    },\r\n    {\r\n        \"id\": \"registration\",\r\n        \"title_geo\": \"ონლაინ რეგისტრაცია\",\r\n        \"title_eng\": \"Online Registration\",\r\n        \"content_geo\": \"<button style=\'background: #555; color: #aaa; border: none; padding: 10px 20px; cursor: not-allowed; width: 100%;\'>რეგისტრაცია დასრულებულია 🚫</button>\",\r\n        \"content_eng\": \"<button style=\'background: #555; color: #aaa; border: none; padding: 10px 20px; cursor: not-allowed; width: 100%;\'>Registration Closed 🚫</button>\"\r\n    }\r\n]');

-- --------------------------------------------------------

--
-- Table structure for table `contact_info`
--

DROP TABLE IF EXISTS `contact_info`;
CREATE TABLE `contact_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `phone` varchar(50) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `address_geo` varchar(255) DEFAULT NULL,
  `address_eng` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `contact_info`
--

INSERT INTO `contact_info` (`id`, `phone`, `email`, `address_geo`, `address_eng`) VALUES
(7, '+995 551 11 19 89', 'gaaci2014@gmail.com', 'რუსთაველის გამზ. №104, 4600, ქუთაისი, საქართველო', '104 Rustaveli Ave, 4600, Kutaisi, Georgia');

-- --------------------------------------------------------

--
-- Table structure for table `employees`
--

DROP TABLE IF EXISTS `employees`;
CREATE TABLE `employees` (
  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name_geo` varchar(255) NOT NULL,
  `name_eng` varchar(255) NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `details_geo` text DEFAULT NULL,
  `details_eng` text DEFAULT NULL,
  `order_index` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `employees`
--

INSERT INTO `employees` (`id`, `name_geo`, `name_eng`, `image_url`, `details_geo`, `details_eng`, `order_index`, `created_at`) VALUES
(1, 'აკადემიკოსი რევაზ სეფიაშვილი', 'Academician Revaz Sepiashvili', '/uploads/1768365080288.jpg', 'საქართველოს  მეცნიერებათა ეროვნული აკადემიის ალერგოლოგიის, ასთმის და კლინიკური იმუნოლოგიის ინსტიტუტის დირექტორი, მსოფლიო იმუნოპათოლოგიის ორგანიზაციის პრეზიდენტი', 'Director of National Institute of Allergology, Asthma & Clinical Immunology, Georgian National Academy of Sciences\r\n\r\nPresident of World Immunopathology Organization', 1, '2026-01-14 03:18:02'),
(2, 'მანანა ჩიხლაძე', 'Manana Chikhladze', '/uploads/1768365108100.jpg', 'ალერგიის მსოფლიო ორგანიზაციის დირექტორთა საბჭოს წევრი\r\n\r\nსაქართველოს მეცნიერებათა ეროვნული აკადემიის  ალერგოლოგიის,ასთმის და კლინიკური იმუნოლოგიის ინსტიტუტის დირექტორის მოადგილე\r\n\r\nაკაკი წერეთლის  სახელმწიფო უნივერსიტეტის ასოცირებული პროფესორი', 'Member of the Board of Directors, World Allergy Organization\r\n\r\nDeputy Director of the National Institute of Allergology, Asthma & Clinical Immunology, Georgian National Academy of Sciences\r\n\r\nAssiciated professor at Akaki Tsereteli State University', 2, '2026-01-14 03:18:02'),
(3, 'თინათინ ჩიქოვანი', 'Tinatin Chikovani', '/uploads/1768365135490.jpg', 'პროფესორი,  თბილისის სახელმწიფო სამედიცინო უნივერსიტეტის იმუნოლოგიის დეპარტამენტის ხელმძღვანელი\r\n\r\n თსსუ-ის სასწავლო პროგრამების მართვის, შეფასებისა და სტუდენტთა რეგისტრაციის დეპარტამენტის უფროსი', 'Professor of Medicine, Head of Department of Immunology, Tbilisi State Medical University, Tbilisi, Georgia\r\n\r\nHead of Department of Educational Program Management, Assessment and Students Registration, Tbilisi State Medical University, Tbilisi, Georgia', 3, '2026-01-14 03:18:02'),
(4, 'ლაშა ჭელიძე', 'Lasha Tchelidze', '/uploads/1768652427388.jpeg', 'საკიას დირექტორი, დიპლომირებული მედიკოსი, თბილისის სახელმწიფო სამედიცინო უნივერსიტეტის სამედიცინო ბიოლოგიისა და პარაზიტოლოგიის დეპარტამენტის მოწვეული ლექტორი', 'Director of the GAACI, Medical Doctor, Invited Lecturer at Tbilisi State Medical University in the Department of Medical Biology and Parasitology', 4, '2026-01-14 03:18:02'),
(5, 'ია ფანცულაია', 'Ia Pantsulaia', '/uploads/1768365211835.jpg', 'ვლ. ბახუტაშვილის სახელობის სამედიცინო ბიოტექნოლოგიის ინსტიტუტის სამეცნიერო საბჭოს თავმჯდომარე, თბილისიის სახელმწიფო სამედიცინო უნივერსიტეტი', 'Head of the Scientific Board, Vl. Bakhutashvili Institute of Medical Biotechnology, Tbilisi State Medical University', 5, '2026-01-14 03:18:02'),
(6, 'მანანა ჟღენტი', 'Manana Zhgenti', '/uploads/1768365241997.jpg', 'მედიცინის დოქტორი', 'MD, PhD', 6, '2026-01-14 03:18:02');

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
CREATE TABLE `events` (
  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `title_geo` varchar(255) NOT NULL,
  `title_eng` varchar(255) NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `event_date` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `custom_fields` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`custom_fields`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`id`, `title_geo`, `title_eng`, `image_url`, `event_date`, `created_at`, `custom_fields`) VALUES
(26, 'კონგრესი 2024', 'Congress 2024', 'images/congress1.png', '2024-05-01 10:00:00', '2026-01-14 14:36:16', '[\r\n    {\r\n        \"id\": \"intro\",\r\n        \"title_geo\": \"მიმოხილვა\",\r\n        \"title_eng\": \"Overview\",\r\n        \"content_geo\": \"<p>2024 წლის კონგრესი ფოკუსირებული იყო პერსონალიზებულ მედიცინაზე ალერგოლოგიაში. კონგრესს ესწრებოდა 500-ზე მეტი დელეგატი.</p>\",\r\n        \"content_eng\": \"<p>The 2024 Congress focused on personalized medicine in allergology. The congress was attended by over 500 delegates.</p>\"\r\n    },\r\n    {\r\n        \"id\": \"speakers\",\r\n        \"title_geo\": \"სპიკერები\",\r\n        \"title_eng\": \"Speakers\",\r\n        \"content_geo\": \"<p>მოწვეული იყვნენ წამყვანი ექსპერტები ევროპიდან და აშშ-დან.</p><ul><li>პროფ. იოჰანეს ჰოლერი</li><li>დოქტ. მარია გარსია</li></ul>\",\r\n        \"content_eng\": \"<p>Leading experts from Europe and the USA were invited.</p><ul><li>Prof. Johannes Holler</li><li>Dr. Maria Garcia</li></ul>\"\r\n    },\r\n    {\r\n        \"id\": \"program\",\r\n        \"title_geo\": \"პროგრამა\",\r\n        \"title_eng\": \"Program\",\r\n        \"content_geo\": \"<p>სამეცნიერო პროგრამა მოიცავდა პლენარულ სესიებსა და ვორქშოფებს.</p>\",\r\n        \"content_eng\": \"<p>The scientific program included plenary sessions and workshops.</p>\"\r\n    }\r\n]'),
(27, 'ასთმის სკოლა 2023', 'Asthma School 2023', 'images/asthma.jpg', '2023-11-15 14:00:00', '2026-01-14 14:36:16', '[\r\n    {\r\n        \"id\": \"main\",\r\n        \"title_geo\": \"პროექტის შესახებ\",\r\n        \"title_eng\": \"About the Project\",\r\n        \"content_geo\": \"<p>პროექტი მიზნად ისახავდა პაციენტების განათლებას ასთმის მართვის საკითხებში.</p>\",\r\n        \"content_eng\": \"<p>The project aimed to educate patients on asthma management issues.</p>\"\r\n    },\r\n    {\r\n        \"id\": \"topics\",\r\n        \"title_geo\": \"თემები\",\r\n        \"title_eng\": \"Topics\",\r\n        \"content_geo\": \"<ol><li>ინჰალაციური ტექნიკა</li><li>გამომწვევი ფაქტორების თავიდან აცილება</li></ol>\",\r\n        \"content_eng\": \"<ol><li>Inhalation techniques</li><li>Avoiding triggers</li></ol>\"\r\n    }\r\n]'),
(28, 'კლინიკური იმუნოლოგიის სიმპოზიუმი 2025', 'Clinical Immunology Symposium 2025', 'images/symposium_hall.png', '2025-09-12 09:30:00', '2026-01-14 14:36:16', '[\r\n    {\r\n        \"id\": \"intro\",\r\n        \"title_geo\": \"შესავალი\",\r\n        \"title_eng\": \"Introduction\",\r\n        \"content_geo\": \"<div style=\'padding: 20px; background: rgba(255,255,255,0.05); border-radius: 8px;\'><h3 style=\'color: var(--accent-yellow); border-bottom: 2px solid var(--accent-yellow); padding-bottom: 10px;\'>შესავალი</h3><p>საერთაშორისო სიმპოზიუმი მიძღვნილია კლინიკური იმუნოლოგიის უახლესი მიღწევებისადმი.</p><img src=\'images/symposium_hall.png\' style=\'width: 100%; border-radius: 8px; margin-top: 15px; border: 1px solid #444;\'></div>\",\r\n        \"content_eng\": \"<div style=\'padding: 20px; background: rgba(255,255,255,0.05); border-radius: 8px;\'><h3 style=\'color: var(--accent-yellow); border-bottom: 2px solid var(--accent-yellow); padding-bottom: 10px;\'>Introduction</h3><p>The international symposium is dedicated to the latest achievements in clinical immunology.</p><img src=\'images/symposium_hall.png\' style=\'width: 100%; border-radius: 8px; margin-top: 15px; border: 1px solid #444;\'></div>\"\r\n    },\r\n    {\r\n        \"id\": \"committee\",\r\n        \"title_geo\": \"საპროგრამო კომიტეტი\",\r\n        \"title_eng\": \"Program Committee\",\r\n        \"content_geo\": \"<div style=\'display: grid; grid-template-columns: 1fr 1fr; gap: 20px; text-align: center;\'><div style=\'background: #222; padding: 15px; border-radius: 8px;\'><strong style=\'color: #fff; font-size: 1.1em; display: block; margin-bottom: 5px;\'>თავმჯდომარე</strong><span style=\'color: #aaa;\'>პროფ. გიორგი ბერიძე</span></div><div style=\'background: #222; padding: 15px; border-radius: 8px;\'><strong style=\'color: #fff; font-size: 1.1em; display: block; margin-bottom: 5px;\'>თანათავმჯდომარე</strong><span style=\'color: #aaa;\'>დოქტ. ნინო შარაშიძე</span></div></div>\",\r\n        \"content_eng\": \"<div style=\'display: grid; grid-template-columns: 1fr 1fr; gap: 20px; text-align: center;\'><div style=\'background: #222; padding: 15px; border-radius: 8px;\'><strong style=\'color: #fff; font-size: 1.1em; display: block; margin-bottom: 5px;\'>Chair</strong><span style=\'color: #aaa;\'>Prof. Giorgi Beridze</span></div><div style=\'background: #222; padding: 15px; border-radius: 8px;\'><strong style=\'color: #fff; font-size: 1.1em; display: block; margin-bottom: 5px;\'>Co-Chair</strong><span style=\'color: #aaa;\'>Dr. Nino Sharashidze</span></div></div>\"\r\n    },\r\n    {\r\n        \"id\": \"faculty\",\r\n        \"title_geo\": \"ფაკულტეტი\",\r\n        \"title_eng\": \"Faculty\",\r\n        \"content_geo\": \"<ul style=\'list-style: none; padding: 0;\'><li style=\'background: linear-gradient(90deg, #333, transparent); padding: 10px; margin-bottom: 5px; border-left: 4px solid var(--accent-yellow);\'>👨‍⚕️ <strong>დოქტ. დავით კობახიძე</strong> - იმუნოლოგი</li><li style=\'background: linear-gradient(90deg, #333, transparent); padding: 10px; margin-bottom: 5px; border-left: 4px solid var(--accent-cyan);\'>👩‍⚕️ <strong>დოქტ. მარიამ გიორგაძე</strong> - ალერგოლოგი</li></ul>\",\r\n        \"content_eng\": \"<ul style=\'list-style: none; padding: 0;\'><li style=\'background: linear-gradient(90deg, #333, transparent); padding: 10px; margin-bottom: 5px; border-left: 4px solid var(--accent-yellow);\'>👨‍⚕️ <strong>Dr. David Kobakhidze</strong> - Immunologist</li><li style=\'background: linear-gradient(90deg, #333, transparent); padding: 10px; margin-bottom: 5px; border-left: 4px solid var(--accent-cyan);\'>👩‍⚕️ <strong>Dr. Mariam Giorgadze</strong> - Allergologist</li></ul>\"\r\n    },\r\n    {\r\n        \"id\": \"cme\",\r\n        \"title_geo\": \"CME კრედიტები\",\r\n        \"title_eng\": \"CME Credits\",\r\n        \"content_geo\": \"<div style=\'border: 2px dashed var(--accent-cyan); padding: 15px; border-radius: 8px; text-align: center; color: var(--accent-cyan); font-weight: bold;\'>🎓 12 CME კრედიტ-ქულა</div>\",\r\n        \"content_eng\": \"<div style=\'border: 2px dashed var(--accent-cyan); padding: 15px; border-radius: 8px; text-align: center; color: var(--accent-cyan); font-weight: bold;\'>🎓 12 CME Credits</div>\"\r\n    },\r\n    {\r\n        \"id\": \"fees\",\r\n        \"title_geo\": \"სარეგისტრაციო გადასახადი\",\r\n        \"title_eng\": \"Registration Fee\",\r\n        \"content_geo\": \"<table style=\'width: 100%; border-collapse: collapse; margin-top: 10px;\'><thead><tr style=\'background: #333;\'><th style=\'padding: 10px; text-align: left;\'>კატეგორია</th><th style=\'padding: 10px; text-align: right;\'>ფასი</th></tr></thead><tbody><tr><td style=\'padding: 10px; border-bottom: 1px solid #444;\'>ადრეული რეგისტრაცია</td><td style=\'padding: 10px; text-align: right; border-bottom: 1px solid #444;\'>100 GEL</td></tr><tr><td style=\'padding: 10px;\'>სტანდარტული</td><td style=\'padding: 10px; text-align: right;\'>150 GEL</td></tr></tbody></table>\",\r\n        \"content_eng\": \"<table style=\'width: 100%; border-collapse: collapse; margin-top: 10px;\'><thead><tr style=\'background: #333;\'><th style=\'padding: 10px; text-align: left;\'>Category</th><th style=\'padding: 10px; text-align: right;\'>Price</th></tr></thead><tbody><tr><td style=\'padding: 10px; border-bottom: 1px solid #444;\'>Early Bird</td><td style=\'padding: 10px; text-align: right; border-bottom: 1px solid #444;\'>100 GEL</td></tr><tr><td style=\'padding: 10px;\'>Standard</td><td style=\'padding: 10px; text-align: right;\'>150 GEL</td></tr></tbody></table>\"\r\n    },\r\n    {\r\n        \"id\": \"venue\",\r\n        \"title_geo\": \"ჩატარების ადგილი\",\r\n        \"title_eng\": \"Venue\",\r\n        \"content_geo\": \"<div style=\'position: relative;\'><img src=\'images/symposium_hall.png\' style=\'width: 100%; height: 200px; object-fit: cover; filter: brightness(0.7); border-radius: 8px;\'><div style=\'position: absolute; bottom: 20px; left: 20px; color: white; text-shadow: 0 2px 4px rgba(0,0,0,0.8);\'><h3>სასტუმრო პულმანი</h3><p>თბილისი, საქართველო</p></div></div>\",\r\n        \"content_eng\": \"<div style=\'position: relative;\'><img src=\'images/symposium_hall.png\' style=\'width: 100%; height: 200px; object-fit: cover; filter: brightness(0.7); border-radius: 8px;\'><div style=\'position: absolute; bottom: 20px; left: 20px; color: white; text-shadow: 0 2px 4px rgba(0,0,0,0.8);\'><h3>Hotel Pullman</h3><p>Tbilisi, Georgia</p></div></div>\"\r\n    },\r\n    {\r\n        \"id\": \"contact\",\r\n        \"title_geo\": \"კონგრესის სამდივნო\",\r\n        \"title_eng\": \"Congress Secretariat\",\r\n        \"content_geo\": \"<div style=\'background: #111; padding: 20px; border-radius: 4px; border-left: 5px solid red;\'><p>📞 +995 555 123 456</p><p>📧 info@gaaci.ge</p></div>\",\r\n        \"content_eng\": \"<div style=\'background: #111; padding: 20px; border-radius: 4px; border-left: 5px solid red;\'><p>📞 +995 555 123 456</p><p>📧 info@gaaci.ge</p></div>\"\r\n    }\r\n]'),
(29, 'მედიცინისა და ხელოვნების გალერეა', 'Medical and Art Gallery', 'images/medical_art_gallery.png', '2025-10-20 18:00:00', '2026-01-14 14:36:16', '[{\"id\":\"about\",\"title_geo\":\"გამოფენის შესახებ\",\"title_eng\":\"About the Exhibition\",\"content_geo\":\"<p style=\\\"font-size: 1.1em; line-height: 1.6;\\\">უნიკალური გამოფენა, სადაც წარმოდგენილია <em>მიკროსკოპული იმუნოლოგიური სურათები</em>.</p><p><img src=\\\"images/medical_art_gallery.png\\\" style=\\\"width: 100%; margin: 20px 0; border-radius: 8px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);\\\"></p>\",\"content_eng\":\"<p style=\\\"font-size: 1.1em; line-height: 1.6;\\\">A unique exhibition showcasing <em>microscopic immunological images</em>.</p><p><img src=\\\"images/medical_art_gallery.png\\\" style=\\\"width: 100%; margin: 20px 0; border-radius: 8px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);\\\"></p>\"},{\"id\":\"venue\",\"title_geo\":\"ჩატარების ადგილი\",\"title_eng\":\"Venue\",\"content_geo\":\"<p><br></p>\",\"content_eng\":\"<p><br></p>\"},{\"id\":\"sponsorship\",\"title_geo\":\"სპონსორობა\",\"title_eng\":\"Sponsorship\",\"content_geo\":\"<p><br></p>\",\"content_eng\":\"<p><br></p>\"},{\"id\":\"1768651478889\",\"title_geo\":\"ტესტ\",\"title_eng\":\"test\",\"content_geo\":\"<h2 class=\\\"ql-align-center\\\">PROGRAM COMMITTEE CO-CHAIRS</h2><p><img src=\\\"http://wipocis.org/viewImg.php?img_id=196&amp;showtext=0&amp;tabname=Templates\\\">&nbsp;<img src=\\\"http://wipocis.org/viewImg.php?img_id=189&amp;showtext=0&amp;tabname=Templates\\\">&nbsp;<img src=\\\"http://wipocis.org/viewImg.php?img_id=163&amp;showtext=0&amp;tabname=Templates\\\">&nbsp;<img src=\\\"http://wipocis.org/viewImg.php?img_id=168&amp;tabname=Templates&amp;showtext=0\\\"><strong>Walter Canonica</strong></p><p>&nbsp;&nbsp;<strong>Ronald Dahl</strong></p><p>&nbsp;&nbsp;<strong>Rudolf Valenta</strong></p><p>&nbsp;&nbsp;<strong>Revaz Sepiashvili</strong></p><p>&nbsp;</p><p>&nbsp;</p><p class=\\\"ql-align-center\\\"><strong>Supported by</strong></p><p class=\\\"ql-align-center\\\">representatives and members of</p><p class=\\\"ql-align-center\\\"><strong>World Immunopathology Organization (WIPO)</strong></p><p class=\\\"ql-align-center\\\"><strong>World Allergy Organization (WAO)</strong></p><p class=\\\"ql-align-center\\\"><strong>International Association of Asthmology (INTERASMA)</strong></p><p class=\\\"ql-align-center\\\"><strong>American College of Allergy, Asthma and Immunology (ACAAI)</strong></p><p class=\\\"ql-align-center\\\"><strong>American Academy of Allergy, Asthma and Immunology (AAAAI)</strong></p><p class=\\\"ql-align-center\\\"><strong>American Thoracic Society (ATS)</strong></p><p class=\\\"ql-align-center\\\"><strong>European Respiratory Society (ERS)</strong></p><p class=\\\"ql-align-center\\\"><strong>European Academy of Allergy and Clinical Immunology (EAACI)</strong></p><p class=\\\"ql-align-center\\\"><strong>Latin American Thoracic Association (LATA)</strong></p><p class=\\\"ql-align-center\\\"><strong>Asia Pacific Respiratory Society (APSR)</strong></p><p class=\\\"ql-align-center\\\"><strong>Georgian Respiratory Association (GRA)</strong></p><p class=\\\"ql-align-center\\\"><strong>Georgian Pediatric Association of Allergology and Clinical Immunology (GPAACI)</strong></p><p class=\\\"ql-align-center\\\"><strong>WORLD ALLERGY TRAINING SCHOOL (WATS)</strong></p><p class=\\\"ql-align-center\\\">organized by World Allergy Organization (WAO)</p><p class=\\\"ql-align-center\\\"><strong>Host Society</strong></p><p class=\\\"ql-align-center\\\"><strong>Georgian Association of Allergology and Clinical Immunology (GAACI)</strong></p><p><br></p>\",\"content_eng\":\"<h2 class=\\\"ql-align-center\\\">PROGRAM COMMITTEE CO-CHAIRS</h2><p><img src=\\\"http://wipocis.org/viewImg.php?img_id=196&amp;showtext=0&amp;tabname=Templates\\\">&nbsp;<img src=\\\"http://wipocis.org/viewImg.php?img_id=189&amp;showtext=0&amp;tabname=Templates\\\">&nbsp;<img src=\\\"http://wipocis.org/viewImg.php?img_id=163&amp;showtext=0&amp;tabname=Templates\\\">&nbsp;<img src=\\\"http://wipocis.org/viewImg.php?img_id=168&amp;tabname=Templates&amp;showtext=0\\\"><strong>Walter Canonica</strong></p><p>&nbsp;&nbsp;<strong>Ronald Dahl</strong></p><p>&nbsp;&nbsp;<strong>Rudolf Valenta</strong></p><p>&nbsp;&nbsp;<strong>Revaz Sepiashvili</strong></p><p>&nbsp;</p><p>&nbsp;</p><p class=\\\"ql-align-center\\\"><strong>Supported by</strong></p><p class=\\\"ql-align-center\\\">representatives and members of</p><p class=\\\"ql-align-center\\\"><strong>World Immunopathology Organization (WIPO)</strong></p><p class=\\\"ql-align-center\\\"><strong>World Allergy Organization (WAO)</strong></p><p class=\\\"ql-align-center\\\"><strong>International Association of Asthmology (INTERASMA)</strong></p><p class=\\\"ql-align-center\\\"><strong>American College of Allergy, Asthma and Immunology (ACAAI)</strong></p><p class=\\\"ql-align-center\\\"><strong>American Academy of Allergy, Asthma and Immunology (AAAAI)</strong></p><p class=\\\"ql-align-center\\\"><strong>American Thoracic Society (ATS)</strong></p><p class=\\\"ql-align-center\\\"><strong>European Respiratory Society (ERS)</strong></p><p class=\\\"ql-align-center\\\"><strong>European Academy of Allergy and Clinical Immunology (EAACI)</strong></p><p class=\\\"ql-align-center\\\"><strong>Latin American Thoracic Association (LATA)</strong></p><p class=\\\"ql-align-center\\\"><strong>Asia Pacific Respiratory Society (APSR)</strong></p><p class=\\\"ql-align-center\\\"><strong>Georgian Respiratory Association (GRA)</strong></p><p class=\\\"ql-align-center\\\"><strong>Georgian Pediatric Association of Allergology and Clinical Immunology (GPAACI)</strong></p><p class=\\\"ql-align-center\\\"><strong>WORLD ALLERGY TRAINING SCHOOL (WATS)</strong></p><p class=\\\"ql-align-center\\\">organized by World Allergy Organization (WAO)</p><p class=\\\"ql-align-center\\\"><strong>Host Society</strong></p><p class=\\\"ql-align-center\\\"><strong>Georgian Association of Allergology and Clinical Immunology (GAACI)</strong></p><p><br></p>\"}]');

-- --------------------------------------------------------

--
-- Table structure for table `news`
--

DROP TABLE IF EXISTS `news`;
CREATE TABLE `news` (
  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `title_geo` varchar(255) NOT NULL,
  `title_eng` varchar(255) NOT NULL,
  `content_geo` longtext DEFAULT NULL,
  `content_eng` longtext DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `news`
--

INSERT INTO `news` (`id`, `title_geo`, `title_eng`, `content_geo`, `content_eng`, `image_url`, `created_at`) VALUES
(1, '2025 წლის წლიური კონფერენცია', 'Annual Conference 2025 Announced', '<p>საქართველოს ალერგოლოგიისა და კლინიკური იმუნოლოგიის ასოციაცია აცხადებს 2025 წლის წლიურ კონფერენციას. დეტალები მალე გახდება ცნობილი.</p>', '<p>The Georgian Association of Allergology and Clinical Immunology announces the Annual Conference for 2025. Details will be available soon.</p>', 'https://placehold.co/600x400?text=Conference+2025', '2026-01-15 08:36:44'),
(2, 'ახალი გაიდლაინები ასთმის მართვაში', 'New Guidelines for Asthma Management', '<p>გამოქვეყნდა ასთმის მართვის განახლებული საერთაშორისო გაიდლაინები. იხილეთ სრული დოკუმენტაცია ჩვენს რესურსებში.</p>', '<p>Updated international guidelines for asthma management have been published. See full documentation in our resources section.</p>', 'https://placehold.co/600x400?text=Asthma+Guidelines', '2026-01-15 08:36:44'),
(3, 'ვორქშოპი პედიატრიულ ალერგიებზე', 'Workshop on Pediatric Allergies', '<p>ჩატარდა საინტერესო ვორქშოპი ბავშვთა ალერგოლოგიის აქტუალურ საკითხებზე. მადლობა ყველა მონაწილეს.</p>', '<p>An interesting workshop on current issues in pediatric allergology was held. Thanks to all participants.</p>', 'https://placehold.co/600x400?text=Pediatric+Workshop', '2026-01-15 08:36:44'),
(4, 'თანამშრომლობა ევროპულ ასოციაციასთან (EAACI)', 'Collaboration with EAACI', '<p>ჩვენი ასოციაცია აღრმავებს თანამშრომლობას ევროპის ალერგოლოგიისა და კლინიკური იმუნოლოგიის აკადემიასთან.</p>', '<p>Our association is deepening its collaboration with the European Academy of Allergy and Clinical Immunology (EAACI).</p>', 'https://placehold.co/600x400?text=EAACI+Collaboration', '2026-01-15 08:36:44');

-- --------------------------------------------------------

--
-- Table structure for table `publications`
--

DROP TABLE IF EXISTS `publications`;
CREATE TABLE `publications` (
  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `title_geo` varchar(255) NOT NULL,
  `title_eng` varchar(255) NOT NULL,
  `link` varchar(500) NOT NULL,
  `order_index` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `publications`
--

INSERT INTO `publications` (`id`, `title_geo`, `title_eng`, `link`, `order_index`, `created_at`) VALUES
(1, 'მოხსენებების აბსტრაქტთა კრებული', 'Collection of abstracts of reports', 'https://gaaci.ge/img/publications/171759054512.pdf', 0, '2026-01-14 16:32:51'),
(2, 'ანაფილაქსია (მოკლე სახელმძღვანელო)', 'Anaphylaxis (a quick guide)', 'https://gaaci.ge/img/publications/169849390812.pdf', 1, '2026-01-14 16:33:13');

-- --------------------------------------------------------

--
-- Table structure for table `sections`
--

DROP TABLE IF EXISTS `sections`;
CREATE TABLE `sections` (
  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `title_geo` varchar(255) DEFAULT NULL,
  `title_eng` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `sections`
--

INSERT INTO `sections` (`id`, `title_geo`, `title_eng`) VALUES
(44, 'ალერგია და ასთმა', 'Allergy and Asthma'),
(45, 'ბაზისური იმუნოლოგია', 'Basic Immunology'),
(46, 'კლინიკური იმუნოლოგია', 'Clinical Immunology'),
(47, 'პედიატრია', 'Pediatrics'),
(48, 'ვაქცინაცია', 'Vaccination'),
(49, 'დერმატოლოგია', 'Dermatology'),
(50, 'ინფექციური დაავადებები', 'Infectious Diseases');

-- --------------------------------------------------------

--
-- Table structure for table `upcoming_events`
--

DROP TABLE IF EXISTS `upcoming_events`;
CREATE TABLE `upcoming_events` (
  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `title_geo` varchar(255) DEFAULT NULL,
  `title_eng` varchar(255) DEFAULT NULL,
  `location_geo` varchar(255) DEFAULT NULL,
  `location_eng` varchar(255) DEFAULT NULL,
  `start_date` datetime DEFAULT NULL,
  `end_date` datetime DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `custom_fields` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`custom_fields`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `upcoming_events`
--

INSERT INTO `upcoming_events` (`id`, `title_geo`, `title_eng`, `location_geo`, `location_eng`, `start_date`, `end_date`, `image_url`, `custom_fields`) VALUES
(12, 'საქართველოს ალერგოლოგიისა და კლინიკური იმუნოლოგიის კონგრესი 2026', 'Georgian Association of Allergology and Clinical Immunology Congress 2026', 'თბილისი, რედისონ ბლუ', 'Tbilisi, Radisson Blu', '2026-05-03 09:00:00', '2026-05-06 18:00:00', 'images/upcoming.png', '[{\"id\":\"1768651699553\",\"title_geo\":\"კონგრესში მონაწილეობის ფორმა\",\"title_eng\":\"Congress Participation Form\",\"content_geo\":\"<p><span style=\\\"color: rgb(92, 88, 90);\\\">კონგრესში მონაწილეობა შეგიძლიათ ზეპირი/პოსტერული მოხსენებით ან მოხსენების გარეშე.</span></p>\",\"content_eng\":\"<p><span style=\\\"color: rgb(92, 88, 90);\\\">You can participate in the Congress with an oral/poster presentation or without a presentation.</span></p>\"},{\"id\":\"1768651747208\",\"title_geo\":\"კონგრესში მონაწილეობის სარეგისტრაციო თანხა\",\"title_eng\":\"Congress Registration Fee\",\"content_geo\":\"<p><strong>2025 წლის 10 ოქტომბრამდე:</strong></p><p>*მონაწილე, რომელიც არის საკიას წევრი - 250 ლარი;</p><p>*მონაწილე, რომელიც არ არის საკიას წევრი - 370 ლარი;</p><p>*საკიას 35 წლამდე წევრებისთვის - 120 ლარი.</p><p><br></p><p><strong>2025 წლის 10 ოქტომბრიდან 2026 წლის 1-ელ თებერვლამდე:</strong></p><p>*მონაწილე, რომელიც არის საკიას წევრი - 290 ლარი;</p><p>*მონაწილე, რომელიც არ არის საკიას წევრი - 420 ლარი;</p><p>*საკიას 35 წლამდე წევრებისთვის - 150 ლარი.</p><p><br></p><p><strong>2026 წლის 1-ელი თებერვლის შემდეგ:</strong></p><p>*მონაწილე, რომელიც არის საკიას წევრი - 350 ლარი;</p><p>*მონაწილე, რომელიც არ არის საკიას წევრი - 490 ლარი;</p><p>*საკიას 35 წლამდე წევრებისთვის - 190 ლარი.</p><p><br></p><p>კონგრესის სარეგისტრაციო თანხის ჩარიცხვა ხდება ანგარიშზე:&nbsp;</p><p><strong>ასოციაციის რეკვიზიტებია:</strong></p><p><strong>ასოციაციის ანგარიში: ს.ს „საქართველოს ბანკი“,</strong></p><p><strong>ბანკის კოდი: BAGAGE22</strong></p><p><strong>ანგარიშის ნომერი: GE79BG0000000818116400GEL</strong></p><p><strong>საქართველოს ალერგოლოგიისა და კლინიკური იმუნოლოგიის ასოციაცია</strong></p><p><br></p><p><strong>კონგრესზე რეგისტრაციისთვის გთხოვთ შეავსოთ ფორმა</strong>:&nbsp;<a href=\\\"https://forms.gle/69poLbud1dzHbJ8bA\\\" target=\\\"_blank\\\">https://forms.gle/69poLbud1dzHbJ8bA</a>&nbsp;</p>\",\"content_eng\":\"<p><strong>Until October 10, 2025:</strong></p><p>*Participant who is a member of the GAACI - 250 GEL;</p><p>*Participant who is not a member of the GAACI - 370 GEL;</p><p>*For the GAACI members under 35 years of age - 120 GEL.</p><p><br></p><p><strong>From October 10, 2025 to February 1, 2026:</strong></p><p>*Participant who is a member the GAACI - 290 GEL;</p><p>*Participant who is not a member of the GAACI - 420 GEL;</p><p>*For the GAACI members under 35 years of age - 150 GEL.</p><p><br></p><p><strong>After February 1, 2026:</strong></p><p>*Participant who is a member of the GAACI - 350 GEL;</p><p>*Participant who is not a member of the GAACI - 490 GEL;</p><p>*For the GAACI members under 35 years of age - 190 GEL.</p><p><br></p><p>***<strong>Delegates from foreign countries who are not members of the GAACI:</strong></p><p><br></p><p><strong>Before February 1, 2026:</strong></p><p>Regular fee: 490 EUR</p><p>Under 35 years of age: 290 EUR</p><p><br></p><p><strong>After February 1, 2026</strong></p><p>Regular fee: 590 EUR</p><p>Under 35 years of age: 390 EUR</p><p><br></p><p>Contact to this E-mail:&nbsp;<a href=\\\"mailto:gaaci2014@gmail.com\\\" target=\\\"_blank\\\">gaaci2014@gmail.com</a>&nbsp;</p><p>&nbsp;</p><p>The congress registration fee is transferred to the account:</p><p><strong>The association\'s details are:</strong></p><p><strong>Association account: JSC \\\"Bank of Georgia\\\",</strong></p><p><strong>Bank code: BAGAGE22</strong></p><p><strong>Account number: GE79BG0000000818116400GEL</strong></p><p><strong>Georgian Association of Allergology and Clinical Immunology</strong></p><p><br></p><p><strong>To register for the congress, please fill out the form:</strong>&nbsp;<a href=\\\"https://forms.gle/69poLbud1dzHbJ8bA\\\" target=\\\"_blank\\\">https://forms.gle/69poLbud1dzHbJ8bA</a>&nbsp;</p>\"},{\"id\":\"1768651795456\",\"title_geo\":\"პუბლიკაცია\",\"title_eng\":\"Publication\",\"content_geo\":\"<p><span style=\\\"color: rgb(92, 88, 90);\\\">საკიას 2026 წლის კონგრესის ფარგლებში შესაძლებელია კონგრესზე მოსახსენებელი მასალის</span></p><p>თეზისის ან სტატიის ფორმით გამოქვეყნება ჟურნალში: \\\"Georgian Biomedical News\\\".</p><p>სტატიის მომზადების წესების შესახებ ინფორმაცია შეგიძლიათ იხილოთ ჟურნალის ვებ-გვერდზე:&nbsp;<a href=\\\"https://www.gbmn.org/\\\" target=\\\"_blank\\\">www.gbmn.org</a>&nbsp;</p><p><br></p><p><strong><em>თეზისის პუბლიკაცია (2025 წლის 10 ოქტომბრამდე)</em></strong></p><p>*მონაწილე, რომელიც არის საკიას წევრი - 150 ლარი;</p><p>*მონაწილე, რომელიც არ არის საკიას წევრი - 210 ლარი.</p><p><br></p><p><strong><em>სტატიის პუბლიკაცია (2025 წლის 10 ოქტომბრამდე)</em></strong></p><p>*მონაწილე, რომელიც არის საკიას წევრი - 350 ლარი;</p><p>*მონაწილე, რომელიც არ არის საკიას წევრი - 450 ლარი.</p><p><br></p><p><strong><u>კონგრესზე აბსტრაქტის წარდგენის ფორმა</u></strong></p><p><br></p><p><strong>კონგრესზე აბსტრაქტის წარსადგენად შეავსეთ ფორმა:</strong>&nbsp;<a href=\\\"https://forms.gle/9JsDSBMqtavghf268\\\" target=\\\"_blank\\\">https://forms.gle/9JsDSBMqtavghf268</a>&nbsp;</p><p>&nbsp;</p><p>გთხოვთ ნებისმიერი კითხვის შემთხვევაში დაგვიკავშირდეთ ელექტრონულ მისამართზე:&nbsp;<a href=\\\"mailto:gaaci2014@gmail.com\\\" target=\\\"_blank\\\">gaaci2014@gmail.com</a>&nbsp;</p>\",\"content_eng\":\"<p>Within the framework of the GAACI 2026 Congress, it is possible to publish the material presented at the congress in the form of a thesis or article in the journal: \\\"Georgian Biomedical News\\\".</p><p>Information about the rules for preparing an article can be found on the journal\'s website:&nbsp;<a href=\\\"https://www.gbmn.org/\\\" target=\\\"_blank\\\">www.gbmn.org</a></p><p><br></p><p><strong><em>Thesis publication (until October 10, 2025)</em></strong></p><p>*Participant who is a member of the GAACI - 150 GEL;</p><p>*Participant who is not a member of the GAACI - 210 GEL.</p><p><br></p><p><strong><em>Article publication (until October 10, 2025)</em></strong></p><p>*Participant who is a member of the GAACI - 350 GEL;</p><p>*Participant who is not a member of the GAACI - 450 GEL.</p><p><br></p><p><strong>Abstract submission form for the congress</strong></p><p><br></p><p><strong>To submit an abstract for the congress, please fill out the form:</strong>&nbsp;<a href=\\\"https://forms.gle/9JsDSBMqtavghf268\\\" target=\\\"_blank\\\">https://forms.gle/9JsDSBMqtavghf268</a>&nbsp;</p><p><br></p><p>Please feel free to contact us with any questions:&nbsp;<a href=\\\"mailto:gaaci2014@gmail.com\\\" target=\\\"_blank\\\">gaaci2014@gmail.com</a>&nbsp;</p>\"}]'),
(13, 'საერთაშორისო ალერგოლოგიური სამიტი 2026', 'II INTERNATIONAL YOUTH OLYMPIAD ON ALLERGOLOGY AND IMMUNOLOGY  ', 'ბათუმი, სასტუმრო ჰილტონი', 'Batumi, Hilton Hotel', '2026-07-15 09:00:00', '2026-07-18 17:00:00', '/uploads/1768402135749.jpg', '[{\"id\":\"committee\",\"title_geo\":\"საპროგრამო კომიტეტი\",\"title_eng\":\"Program Committee\",\"content_geo\":\"<p style=\\\"border-left: 4px solid var(--accent-yellow); padding-left: 10px;\\\">საერთაშორისო საბჭო EAACI-ს ეგიდით.</p>\",\"content_eng\":\"<p style=\\\"border-left: 4px solid var(--accent-yellow); padding-left: 10px;\\\">International board under the auspices of EAACI.</p>\"},{\"id\":\"deadlines\",\"title_geo\":\"ვადები\",\"title_eng\":\"Deadlines\",\"content_geo\":\"<p><br></p><p><br></p>\",\"content_eng\":\"<p><br></p><p><br></p>\"},{\"id\":\"fees\",\"title_geo\":\"სარეგისტრაციო გადასახადი\",\"title_eng\":\"Registration Fee\",\"content_geo\":\"<p><br></p>\",\"content_eng\":\"<p><br></p>\"},{\"id\":\"venue\",\"title_geo\":\"ჩატარების ადგილი\",\"title_eng\":\"Venue\",\"content_geo\":\"<iframe width=\\\"100%\\\" height=\\\"250\\\" frameborder=\\\"0\\\" scrolling=\\\"no\\\" marginheight=\\\"0\\\" marginwidth=\\\"0\\\" src=\\\"https://maps.google.com/maps?q=Hilton%20Batumi&amp;t=&amp;z=13&amp;ie=UTF8&amp;iwloc=&amp;output=embed\\\" style=\\\"border-radius: 8px;\\\" bis_size=\\\"{&quot;x&quot;:1037,&quot;y&quot;:3696,&quot;w&quot;:456,&quot;h&quot;:250,&quot;abs_x&quot;:1037,&quot;abs_y&quot;:3696}\\\" bis_id=\\\"fr_fi88ad8ekltrm4aajml9sr\\\" bis_depth=\\\"0\\\" bis_chainid=\\\"1\\\"></iframe>\",\"content_eng\":\"<iframe width=\\\"100%\\\" height=\\\"250\\\" frameborder=\\\"0\\\" scrolling=\\\"no\\\" marginheight=\\\"0\\\" marginwidth=\\\"0\\\" src=\\\"https://maps.google.com/maps?q=Hilton%20Batumi&amp;t=&amp;z=13&amp;ie=UTF8&amp;iwloc=&amp;output=embed\\\" style=\\\"border-radius: 8px;\\\" bis_size=\\\"{&quot;x&quot;:1037,&quot;y&quot;:4016,&quot;w&quot;:456,&quot;h&quot;:250,&quot;abs_x&quot;:1037,&quot;abs_y&quot;:4016}\\\" bis_id=\\\"fr_n8h50zbjkshl5bibzkimkp\\\" bis_depth=\\\"0\\\" bis_chainid=\\\"2\\\"></iframe>\"},{\"id\":\"registration_online\",\"title_geo\":\"ონლაინ რეგისტრაცია\",\"title_eng\":\"Online Registration\",\"content_geo\":\"<p><a href=\\\"#\\\" style=\\\"display: block; background: var(--accent-yellow); color: black; padding: 15px; text-align: center; font-weight: bold; text-decoration: none; border-radius: 50px; text-transform: uppercase; transition: transform 0.2s;\\\">დააკლიკეთ რეგისტრაციისთვის ➡</a></p>\",\"content_eng\":\"<p><a href=\\\"#\\\" style=\\\"display: block; background: var(--accent-yellow); color: black; padding: 15px; text-align: center; font-weight: bold; text-decoration: none; border-radius: 50px; text-transform: uppercase; transition: transform 0.2s;\\\">Click here to register ➡</a></p>\"}]');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `username` varchar(50) NOT NULL UNIQUE,
  `password_hash` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password_hash`, `created_at`) VALUES
(1, 'admin', '$2b$10$X7.m.fD9.q.r.s.t.u.v.w.x.y.z.A.B.C.D.E.F.G.H.I.J.K.L', '2026-01-12 02:28:33'),
(8, 'agagosha', '$2b$10$F2LccmCjpvd/0iPdY3IEnOotQ3oJvUnTi95bMgvLAo.M5Vee3mcda', '2026-01-14 14:36:16');

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
