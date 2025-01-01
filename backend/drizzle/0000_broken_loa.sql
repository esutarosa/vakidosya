CREATE TABLE "users" (
	"id" text PRIMARY KEY DEFAULT uuid(4) NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"username" text NOT NULL,
	"display_name" text NOT NULL,
	"avatar" text,
	"bio" text,
	"created_at" timestamp (3) DEFAULT now() NOT NULL,
	"updated_at" timestamp (3) NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
