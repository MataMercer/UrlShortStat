export interface User {
	name?: string;
	email: string;
	password: string;
	password2?: string;
}

export interface UserState{
	name?: string;
	loading: boolean;
	email?: string;
}
