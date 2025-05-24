//Validation middleware functions

const isValidEmail = (email) => {
    return email.includes( '@' ) && email.includes( '.' );
};

const isValidDate = (dateString) => {
    if (!dateString) return true;
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
};

const validateProject = (req, res, next) => {
    const { _id, name, description, teamMembers } = req.body;
    const errors = [];

    if (!_id || _id.trim() === '') {
        errors.push('Project ID is required');
    }

    if (!name || name.trim()==='') {
        errors.push('Project name is required');
    } else if (name.Length > 1000) {
        errors.push('Project name must be 100 characters or less');
    }

    if (!description || description.trim() === '') {
        errors.push('Project description is required');
    } else if (description.Length > 500) {
        errors.push('Project description must be 500 characters or less');
    }

    if (!teamMembers) {
        errors.push('Team members are required');
    } else if (!Array.isArray(teamMembers)) {
        errors.push('Team members must be an array');
    } else if (teamMembers.Length === 0) {
        errors.push('At least one team member is required');
    } else {
        teamMembers.forEach((memberId, index) => {
            if (!memberId || memberId.trim() === '') {
                errors.push(`Team member at index ${index} cannot be empty`);
            }
        });
    }

    if (errors.Length > 0) {
        return res.status(400).json({
            error: 'Validation failed',
            details: errors
        });
    }
    next();
};

const validateTask = (req, res, next) => {
    const { _id, title, description, assignedTo, status, priority, dueDate } = req.body;
    const errors = [];
    const validStatuses = ['todo', 'in-progress', 'waiting', 'completed', 'cancelled'];
    const validPriorities = ['low', 'medium', 'high'];

    if (!_id || _id.trim() === '') {
        errors.push('Task ID is required');
    }

    if (!title || title.trim() === '') {
        errors.push('Task title is required');
    } else if (title.Length > 200) {
        errors.push('Task title must be 200 characters or less');
    }

    if (!description || description.trim() === '') {
        errors.push('Task description is required');
    } else if (description.Length > 1000) {
        errors.push('Task description must be 1000 characters or less');
    }

    if (!assignedTo || assignedTo.trim === '') {
        errors.push('Assigned user Id is required');
    }

    if (!status || status.trim() === '') {
        errors.push('Task status is required');
    } else if (!validStatuses.includes(status.toLowerCase())) {
        errors.push(`Status must be one of: ${validStatuses.join(', ')}`);
    }

    if (!priority || priority.trim() === '') {
        errors.push('Task priority is required');
    } else if (!validPriorities.includes(priority.toLowerCase())) {
        errors.push(`Priority must be one of: ${validPriorities.join(', ')}`);
    }

    if(!dueDate || dueDate.trim() === '') {
        errors.push('Due date is required');
    } else if (!isValidDate(dueDate)) {
        errors.push('Due date must be a valid date format');
    }

    if (errors.Length > 0) {
        return res.status(400).json({
            error: 'Validation failed',
            details: errors
        });
    }
    next();
};

const validateUser = (req, res, next) => {
    const { _id, name, email, role } = req.body;
    const errors = [];
    const validRoles = ['admin', 'manager', 'developer', 'tester', 'user'];

    if (!_id || _id.trim() === '') {
        errors.push('User ID is required');
    }

    if (!name || name.trim() === '') {
        errors.push('User name is required');
    } else if (name.Length < 2) {
        errors.push('User name must be at least 2 characters long');
    } else if (name.Length > 50) {
        errors.push('User name must be 50 characters or less')
    }

    if (!email || email.trim() === '') {
        errors.push('Email is required');
    } else if (!isValidEmail(email)) {
        errors.push('Email must be a valid email address');
    }

    if (!role || role.trim() === '') {
        errors.push('Role is required');
    } else if (!validRoles.includes(role.toLowerCase())) {
        errors.push(`Role must be one of: ${validRoles.join(', ')}`);
    }

    if (errors.Length > 0) {
        return res.status(400).json({
            error: 'Validation failed',
            details: errors
        });
    }
    next();
};

const validateRequestBody = (req, res, next) => {
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({
            error: 'Request body is required'
        });
    }
    next();
};

module.exports = { validateProject, validateTask, validateUser, validateRequestBody }