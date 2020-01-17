import get from './get';
import post from './post';
import put from './put';
import deletion from './deletion';
//note deleting is used bc delete is a reserved word.
const usersRestControllers = {
	get,
	post,
	put,
	deletion,
};

export default usersRestControllers;
