CREATE TABLE `shared_habit_members` (
	`id` text PRIMARY KEY NOT NULL,
	`shared_habit_id` text NOT NULL,
	`user_id` text NOT NULL,
	`role` text DEFAULT 'member' NOT NULL,
	`joined_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`shared_habit_id`) REFERENCES `shared_habits`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `shared_habits` (
	`id` text PRIMARY KEY NOT NULL,
	`habit_name` text NOT NULL,
	`habit_icon` text NOT NULL,
	`habit_color` text NOT NULL,
	`target_count` integer,
	`target_period` text,
	`owner_user_id` text NOT NULL,
	`invite_code` text NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`expires_at` text,
	FOREIGN KEY (`owner_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `shared_habits_invite_code_unique` ON `shared_habits` (`invite_code`);--> statement-breakpoint
ALTER TABLE `habits` ADD `is_shared` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `habits` ADD `shared_habit_id` text;