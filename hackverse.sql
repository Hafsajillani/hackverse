-- ============================================================
--  HackVerse — Full MySQL Database Schema + Seed Data
--  Course: Advanced Database Management Systems
--  Run with: mysql -u root -p < hackverse.sql
-- ============================================================

DROP DATABASE IF EXISTS hackverse;
CREATE DATABASE hackverse
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE hackverse;

-- ────────────────────────────────────────────────────────────
-- TABLE: users
-- ────────────────────────────────────────────────────────────
CREATE TABLE users (
  id          INT           NOT NULL AUTO_INCREMENT,
  name        VARCHAR(100)  NOT NULL,
  email       VARCHAR(150)  NOT NULL,
  password    VARCHAR(255)  NOT NULL,          -- store hashed in production
  role        ENUM('participant','organizer') NOT NULL DEFAULT 'participant',
  avatar      VARCHAR(10)   NOT NULL DEFAULT '',
  bio         TEXT,
  location    VARCHAR(100),
  github      VARCHAR(100),
  linkedin    VARCHAR(150),
  wins        INT           NOT NULL DEFAULT 0,
  created_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email),
  CONSTRAINT chk_users_wins CHECK (wins >= 0)
) ENGINE=InnoDB;

-- ────────────────────────────────────────────────────────────
-- TABLE: user_skills  (normalised M:N for skills)
-- ────────────────────────────────────────────────────────────
CREATE TABLE user_skills (
  id       INT           NOT NULL AUTO_INCREMENT,
  user_id  INT           NOT NULL,
  skill    VARCHAR(80)   NOT NULL,

  PRIMARY KEY (id),
  UNIQUE KEY uq_user_skill (user_id, skill),
  CONSTRAINT fk_us_user FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ────────────────────────────────────────────────────────────
-- TABLE: hackathons
-- ────────────────────────────────────────────────────────────
CREATE TABLE hackathons (
  id           INT           NOT NULL AUTO_INCREMENT,
  organizer_id INT           NOT NULL,
  organizer    VARCHAR(100)  NOT NULL,
  title        VARCHAR(200)  NOT NULL,
  theme        VARCHAR(100)  NOT NULL,
  description  TEXT,
  rules        TEXT,
  judging      TEXT,
  prize        VARCHAR(60)   NOT NULL DEFAULT 'TBD',
  prize1       VARCHAR(60),
  prize2       VARCHAR(60),
  prize3       VARCHAR(60),
  participants INT           NOT NULL DEFAULT 0,
  teams        INT           NOT NULL DEFAULT 0,
  status       ENUM('open','closing','upcoming','ended') NOT NULL DEFAULT 'upcoming',
  thumb        VARCHAR(300),
  cover        VARCHAR(300),
  reg_open     DATE,
  reg_close    DATE,
  sub_open     DATE,
  sub_close    DATE,
  deadline     DATE,
  created_at   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  CONSTRAINT fk_hack_org FOREIGN KEY (organizer_id) REFERENCES users(id)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT chk_dates CHECK (reg_open IS NULL OR sub_close IS NULL OR sub_close >= reg_open)
) ENGINE=InnoDB;

-- ────────────────────────────────────────────────────────────
-- TABLE: hackathon_tags
-- ────────────────────────────────────────────────────────────
CREATE TABLE hackathon_tags (
  id           INT          NOT NULL AUTO_INCREMENT,
  hackathon_id INT          NOT NULL,
  tag          VARCHAR(80)  NOT NULL,

  PRIMARY KEY (id),
  UNIQUE KEY uq_hack_tag (hackathon_id, tag),
  CONSTRAINT fk_ht_hack FOREIGN KEY (hackathon_id) REFERENCES hackathons(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ────────────────────────────────────────────────────────────
-- TABLE: hackathon_sponsors
-- ────────────────────────────────────────────────────────────
CREATE TABLE hackathon_sponsors (
  id           INT          NOT NULL AUTO_INCREMENT,
  hackathon_id INT          NOT NULL,
  sponsor      VARCHAR(100) NOT NULL,

  PRIMARY KEY (id),
  UNIQUE KEY uq_hack_sponsor (hackathon_id, sponsor),
  CONSTRAINT fk_hs_hack FOREIGN KEY (hackathon_id) REFERENCES hackathons(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ────────────────────────────────────────────────────────────
-- TABLE: registrations
-- ────────────────────────────────────────────────────────────
CREATE TABLE registrations (
  id             INT          NOT NULL AUTO_INCREMENT,
  hackathon_id   INT          NOT NULL,
  user_id        INT          NOT NULL,
  registered_at  DATE         NOT NULL DEFAULT (CURRENT_DATE),
  status         ENUM('active','withdrawn') NOT NULL DEFAULT 'active',

  PRIMARY KEY (id),
  UNIQUE KEY uq_reg (hackathon_id, user_id),
  CONSTRAINT fk_reg_hack FOREIGN KEY (hackathon_id) REFERENCES hackathons(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_reg_user FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ────────────────────────────────────────────────────────────
-- TABLE: projects
-- ────────────────────────────────────────────────────────────
CREATE TABLE projects (
  id            INT           NOT NULL AUTO_INCREMENT,
  hackathon_id  INT           NOT NULL,
  submitted_by  INT           NOT NULL,
  title         VARCHAR(200)  NOT NULL,
  team          VARCHAR(100),
  tagline       VARCHAR(300),
  description   TEXT,
  demo          VARCHAR(300),
  github        VARCHAR(300),
  video         VARCHAR(300),
  score         TINYINT UNSIGNED NOT NULL DEFAULT 0,
  rank          TINYINT UNSIGNED,
  cover         VARCHAR(300),
  notes         TEXT,
  submitted_at  DATE          NOT NULL DEFAULT (CURRENT_DATE),
  created_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE KEY uq_proj_user_hack (hackathon_id, submitted_by),
  CONSTRAINT fk_proj_hack FOREIGN KEY (hackathon_id) REFERENCES hackathons(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_proj_user FOREIGN KEY (submitted_by) REFERENCES users(id)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT chk_score CHECK (score BETWEEN 0 AND 100)
) ENGINE=InnoDB;

-- ────────────────────────────────────────────────────────────
-- TABLE: project_tech
-- ────────────────────────────────────────────────────────────
CREATE TABLE project_tech (
  id         INT         NOT NULL AUTO_INCREMENT,
  project_id INT         NOT NULL,
  tech       VARCHAR(80) NOT NULL,

  PRIMARY KEY (id),
  UNIQUE KEY uq_proj_tech (project_id, tech),
  CONSTRAINT fk_pt_proj FOREIGN KEY (project_id) REFERENCES projects(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ────────────────────────────────────────────────────────────
-- TABLE: winners
-- ────────────────────────────────────────────────────────────
CREATE TABLE winners (
  id            INT            NOT NULL AUTO_INCREMENT,
  hackathon_id  INT            NOT NULL,
  project_id    INT            NOT NULL,
  rank          TINYINT        NOT NULL,
  assigned_at   DATE           NOT NULL DEFAULT (CURRENT_DATE),

  PRIMARY KEY (id),
  UNIQUE KEY uq_winner_proj (project_id),
  UNIQUE KEY uq_winner_rank (hackathon_id, rank),
  CONSTRAINT fk_win_hack FOREIGN KEY (hackathon_id) REFERENCES hackathons(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_win_proj FOREIGN KEY (project_id) REFERENCES projects(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT chk_rank CHECK (rank BETWEEN 1 AND 10)
) ENGINE=InnoDB;

-- ────────────────────────────────────────────────────────────
-- TABLE: certificates
-- ────────────────────────────────────────────────────────────
CREATE TABLE certificates (
  id            INT           NOT NULL AUTO_INCREMENT,
  hackathon_id  INT           NOT NULL,
  project_id    INT           NOT NULL,
  user_id       INT           NOT NULL,
  rank          TINYINT       NOT NULL,
  label         VARCHAR(100)  NOT NULL,
  icon          VARCHAR(10)   NOT NULL DEFAULT '🏅',
  issued_at     DATE          NOT NULL DEFAULT (CURRENT_DATE),
  issued        TINYINT(1)    NOT NULL DEFAULT 1,

  PRIMARY KEY (id),
  UNIQUE KEY uq_cert_proj_user (project_id, user_id),
  CONSTRAINT fk_cert_hack FOREIGN KEY (hackathon_id) REFERENCES hackathons(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_cert_proj FOREIGN KEY (project_id) REFERENCES projects(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_cert_user FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;


-- ============================================================
--  SEED DATA
-- ============================================================

-- ── USERS ───────────────────────────────────────────────────
INSERT INTO users (id, name, email, password, role, avatar, bio, location, github, linkedin, wins) VALUES
(1,  'Ayesha Raza',   'ayesha@gmail.com',    '1234', 'participant', 'AR', 'Full-stack developer passionate about AI.',          'Lahore',     'ayesharaza',  'ayesharaza',  3),
(2,  'Hassan Ali',    'hassan@gmail.com',    '1234', 'participant', 'HA', 'Backend engineer who loves distributed systems.',    'Karachi',    'hassanali',   'hassanali',   1),
(3,  'Fatima Khan',   'fatima@gmail.com',    '1234', 'participant', 'FK', 'Mobile developer and UI/UX designer.',              'Islamabad',  'fatimakhan',  'fatimakhan',  2),
(4,  'Bilal Ahmed',   'bilal@gmail.com',     '1234', 'participant', 'BA', 'Web3 enthusiast.',                                  'Lahore',     'bilalahmed',  'bilalahmed',  0),
(10, 'TechCorp Org',  'org@techcorp.com',    '1234', 'organizer',   'TC', 'Pakistan''s leading tech innovation lab.',          'Lahore',     '',            '',            0),
(11, 'HBL Lab',       'org@hbl.com',         '1234', 'organizer',   'HB', 'HBL Innovation Lab.',                               'Karachi',    '',            '',            0);

-- ── USER SKILLS ──────────────────────────────────────────────
INSERT INTO user_skills (user_id, skill) VALUES
(1,'React'),(1,'Python'),(1,'ML'),
(2,'Node.js'),(2,'AWS'),(2,'Docker'),
(3,'Flutter'),(3,'Firebase'),(3,'UX'),
(4,'Solidity'),(4,'Web3'),(4,'Rust');

-- ── HACKATHONS ───────────────────────────────────────────────
INSERT INTO hackathons (id, organizer_id, organizer, title, theme, description, rules, judging,
  prize, prize1, prize2, prize3, participants, teams, status,
  thumb, cover, reg_open, reg_close, sub_open, sub_close, deadline) VALUES
(1, 10, 'TechCorp Org',
  'AI Innovation Challenge 2025', 'Artificial Intelligence',
  'Build the next generation of AI-powered solutions for Pakistan and beyond.',
  'Teams of 2-4. Projects must be original. Open source preferred.',
  'Innovation (30%), Technical Complexity (25%), Impact (25%), Presentation (20%)',
  'PKR 500,000','PKR 200,000','PKR 150,000','PKR 100,000',
  1240, 312, 'open',
  'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&q=80',
  'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1400&q=80',
  '2025-05-01','2025-08-10','2025-07-01','2025-08-14','2025-08-15'),

(2, 11, 'HBL Lab',
  'FinTech Forge', 'Financial Technology',
  'Reimagine financial services for the unbanked population of Pakistan.',
  'Must use at least one financial API. Teams of 1-5.',
  'Market Potential (35%), Technical Build (30%), UX Design (20%), Pitch (15%)',
  'PKR 300,000','PKR 120,000','PKR 80,000','PKR 60,000',
  890, 210, 'open',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1400&q=80',
  '2025-05-15','2025-07-25','2025-06-15','2025-07-29','2025-07-30'),

(3, 10, 'TechCorp Org',
  'HealthTech Pakistan', 'Health',
  'Build technology solutions for Pakistan''s healthcare challenges.',
  'Teams of 2-5. Must have working prototype.',
  'Clinical Impact (40%), Technical (30%), Feasibility (30%)',
  'PKR 400,000','PKR 160,000','PKR 120,000','PKR 80,000',
  540, 134, 'upcoming',
  'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80',
  'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1400&q=80',
  '2025-06-01','2025-09-25','2025-08-01','2025-09-28','2025-09-30');

-- ── HACKATHON TAGS ────────────────────────────────────────────
INSERT INTO hackathon_tags (hackathon_id, tag) VALUES
(1,'AI'),(1,'ML'),(1,'Deep Learning'),
(2,'Fintech'),(2,'Blockchain'),(2,'Payments'),
(3,'Health'),(3,'IoT'),(3,'Biotech');

-- ── HACKATHON SPONSORS ────────────────────────────────────────
INSERT INTO hackathon_sponsors (hackathon_id, sponsor) VALUES
(1,'Microsoft'),(1,'Google'),(1,'AWS'),(1,'NVIDIA'),
(2,'HBL'),(2,'Easypaisa'),(2,'JazzCash'),
(3,'AKUH'),(3,'Shaukat Khanum'),(3,'Sehat Kahani');

-- ── REGISTRATIONS ─────────────────────────────────────────────
INSERT INTO registrations (hackathon_id, user_id, registered_at, status) VALUES
(1, 1, '2025-05-10', 'active'),
(1, 2, '2025-05-11', 'active'),
(1, 3, '2025-05-12', 'active'),
(2, 1, '2025-05-15', 'active'),
(2, 3, '2025-05-16', 'active');

-- ── PROJECTS ──────────────────────────────────────────────────
INSERT INTO projects (id, hackathon_id, submitted_by, title, team, tagline, description,
  demo, github, score, submitted_at, cover, notes) VALUES
(1, 1, 1,
  'MediScan AI', 'Team Alpha',
  'AI-powered medical image diagnosis for rural clinics',
  'We built a CV model that diagnoses 12 diseases from X-rays with 94% accuracy.',
  'https://mediscan.demo', 'https://github.com/alpha/mediscan',
  94, '2025-07-28',
  'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&q=80', ''),

(2, 1, 2,
  'FarmBot Pakistan', 'AgriTech Bros',
  'IoT crop monitoring for smallholders',
  'Solar-powered IoT sensors + ML predicts crop yield 3 weeks in advance.',
  '', '',
  89, '2025-07-29',
  'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&q=80', '');

-- ── PROJECT TECH ──────────────────────────────────────────────
INSERT INTO project_tech (project_id, tech) VALUES
(1,'Python'),(1,'TensorFlow'),(1,'FastAPI'),(1,'React'),
(2,'Arduino'),(2,'Python'),(2,'MQTT'),(2,'Vue.js');

-- ── WINNERS ───────────────────────────────────────────────────
INSERT INTO winners (hackathon_id, project_id, rank, assigned_at) VALUES
(1, 1, 1, '2025-08-16'),
(1, 2, 2, '2025-08-16');

-- ── CERTIFICATES ──────────────────────────────────────────────
INSERT INTO certificates (hackathon_id, project_id, user_id, rank, label, icon, issued_at, issued) VALUES
(1, 1, 1, 1, '1st Place Winner', '🥇', '2025-08-20', 1);


-- ============================================================
--  USEFUL VIEWS  (for quick reporting)
-- ============================================================

-- Leaderboard view per hackathon
CREATE OR REPLACE VIEW vw_leaderboard AS
SELECT
  p.hackathon_id,
  h.title        AS hackathon_title,
  p.id           AS project_id,
  p.title        AS project_title,
  p.team,
  p.score,
  w.rank,
  u.name         AS submitted_by_name
FROM projects p
JOIN hackathons h ON h.id = p.hackathon_id
JOIN users      u ON u.id = p.submitted_by
LEFT JOIN winners w ON w.project_id = p.id
ORDER BY p.hackathon_id, p.score DESC;

-- Registration summary per hackathon
CREATE OR REPLACE VIEW vw_registration_summary AS
SELECT
  h.id           AS hackathon_id,
  h.title,
  h.status,
  h.organizer,
  COUNT(r.id)    AS total_registrations,
  SUM(CASE WHEN r.status='active' THEN 1 ELSE 0 END) AS active_registrations
FROM hackathons h
LEFT JOIN registrations r ON r.hackathon_id = h.id
GROUP BY h.id, h.title, h.status, h.organizer;

-- Participant profile with skill list
CREATE OR REPLACE VIEW vw_participant_profiles AS
SELECT
  u.id,
  u.name,
  u.email,
  u.role,
  u.location,
  u.wins,
  GROUP_CONCAT(us.skill ORDER BY us.skill SEPARATOR ', ') AS skills
FROM users u
LEFT JOIN user_skills us ON us.user_id = u.id
GROUP BY u.id, u.name, u.email, u.role, u.location, u.wins;


-- ============================================================
--  STORED PROCEDURES
-- ============================================================

DELIMITER $$

-- Register a user for a hackathon (with duplicate check)
CREATE PROCEDURE sp_register_user(
  IN p_hackathon_id INT,
  IN p_user_id      INT
)
BEGIN
  IF EXISTS (
    SELECT 1 FROM registrations
    WHERE hackathon_id = p_hackathon_id
      AND user_id      = p_user_id
      AND status       = 'active'
  ) THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'User already registered for this hackathon.';
  ELSE
    INSERT INTO registrations (hackathon_id, user_id, registered_at, status)
    VALUES (p_hackathon_id, p_user_id, CURRENT_DATE, 'active');
  END IF;
END$$

-- Submit a project (replaces old submission for same user+hackathon)
CREATE PROCEDURE sp_submit_project(
  IN p_hackathon_id INT,
  IN p_user_id      INT,
  IN p_title        VARCHAR(200),
  IN p_team         VARCHAR(100),
  IN p_tagline      VARCHAR(300),
  IN p_description  TEXT,
  IN p_demo         VARCHAR(300),
  IN p_github       VARCHAR(300)
)
BEGIN
  INSERT INTO projects
    (hackathon_id, submitted_by, title, team, tagline, description, demo, github, submitted_at)
  VALUES
    (p_hackathon_id, p_user_id, p_title, p_team, p_tagline, p_description, p_demo, p_github, CURRENT_DATE)
  ON DUPLICATE KEY UPDATE
    title       = VALUES(title),
    team        = VALUES(team),
    tagline     = VALUES(tagline),
    description = VALUES(description),
    demo        = VALUES(demo),
    github      = VALUES(github);
END$$

-- Issue a winner certificate
CREATE PROCEDURE sp_issue_certificate(
  IN p_hackathon_id INT,
  IN p_project_id   INT,
  IN p_user_id      INT,
  IN p_rank         TINYINT
)
BEGIN
  DECLARE v_label VARCHAR(100);
  SET v_label = CASE p_rank
    WHEN 1 THEN '1st Place Winner'
    WHEN 2 THEN '2nd Place Runner-Up'
    WHEN 3 THEN '3rd Place'
    ELSE CONCAT('Rank ', p_rank)
  END;

  INSERT IGNORE INTO certificates
    (hackathon_id, project_id, user_id, rank, label, icon, issued_at, issued)
  VALUES
    (p_hackathon_id, p_project_id, p_user_id, p_rank, v_label,
     CASE p_rank WHEN 1 THEN '🥇' WHEN 2 THEN '🥈' ELSE '🥉' END,
     CURRENT_DATE, 1);
END$$

DELIMITER ;


-- ============================================================
--  SAMPLE ANALYTICAL QUERIES  (for DBMS report / demo)
-- ============================================================

-- Q1: Top 5 hackathons by number of active registrations
SELECT
  h.id,
  h.title,
  h.organizer,
  h.status,
  COUNT(r.id) AS registrations
FROM hackathons h
JOIN registrations r ON r.hackathon_id = h.id AND r.status = 'active'
GROUP BY h.id, h.title, h.organizer, h.status
ORDER BY registrations DESC
LIMIT 5;

-- Q2: All projects with winner rank and submitter details
SELECT
  p.id        AS project_id,
  p.title     AS project_title,
  p.score,
  w.rank,
  u.name      AS submitter,
  u.location,
  h.title     AS hackathon
FROM projects p
JOIN users      u ON u.id = p.submitted_by
JOIN hackathons h ON h.id = p.hackathon_id
LEFT JOIN winners w ON w.project_id = p.id
ORDER BY h.id, w.rank ASC, p.score DESC;

-- Q3: Participants who registered for more than one hackathon
SELECT
  u.id,
  u.name,
  u.email,
  COUNT(r.hackathon_id) AS hackathons_joined
FROM users u
JOIN registrations r ON r.user_id = u.id AND r.status = 'active'
WHERE u.role = 'participant'
GROUP BY u.id, u.name, u.email
HAVING hackathons_joined > 1
ORDER BY hackathons_joined DESC;

-- Q4: Organizer activity summary
SELECT
  u.name          AS organizer,
  COUNT(h.id)     AS total_events,
  SUM(CASE WHEN h.status='open'     THEN 1 ELSE 0 END) AS open_events,
  SUM(CASE WHEN h.status='ended'    THEN 1 ELSE 0 END) AS ended_events,
  SUM(CASE WHEN h.status='upcoming' THEN 1 ELSE 0 END) AS upcoming_events
FROM users u
JOIN hackathons h ON h.organizer_id = u.id
WHERE u.role = 'organizer'
GROUP BY u.id, u.name;

-- Q5: Certificates issued per hackathon
SELECT
  h.title     AS hackathon,
  COUNT(c.id) AS certificates_issued,
  GROUP_CONCAT(u.name ORDER BY c.rank SEPARATOR ', ') AS winners
FROM hackathons h
JOIN certificates c ON c.hackathon_id = h.id AND c.issued = 1
JOIN users        u ON u.id = c.user_id
GROUP BY h.id, h.title;

-- Q6: Skills most common among winning participants
SELECT
  us.skill,
  COUNT(*) AS winner_count
FROM user_skills us
JOIN users u ON u.id = us.user_id
WHERE u.wins > 0
GROUP BY us.skill
ORDER BY winner_count DESC;