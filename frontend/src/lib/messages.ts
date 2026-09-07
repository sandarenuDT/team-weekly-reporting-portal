export type MessageType = 'success' | 'error' | 'info';

export interface MessageEntry {
  title: string;
  description?: string;
  type: MessageType;
}

export const MESSAGES = {
  // Auth
  'login.success': { title: 'Welcome back', description: 'You\u2019re logged in.', type: 'success' },
  'login.error': { title: 'Login failed', description: 'That email and password don\u2019t match.', type: 'error' },
  'login.validation': { title: 'Missing details', description: 'Enter your email and password.', type: 'error' },
  'register.success': { title: 'Account created', description: 'You can now log in.', type: 'success' },
  'register.error': { title: 'Registration failed', description: 'Couldn\u2019t create your account. Try again.', type: 'error' },
  'register.validation': { title: 'Missing details', description: 'Fill in every field to continue.', type: 'error' },
  'register.weakPassword': { title: 'Password too short', description: 'Use at least 8 characters.', type: 'error' },

  // Reports — team member
  'report.draft.saved': { title: 'Draft saved', description: 'Your changes are stored — you can keep editing.', type: 'success' },
  'report.draft.error': { title: 'Couldn\u2019t save', description: 'Something went wrong saving your draft. Try again.', type: 'error' },
  'report.submit.success': { title: 'Report submitted', description: 'It\u2019s now with your manager for review. You can\u2019t edit it unless changes are requested.', type: 'success' },
  'report.submit.error': { title: 'Couldn\u2019t submit', description: 'Something went wrong submitting your report. Try again.', type: 'error' },
  'report.submit.noTasks': { title: 'Add a task first', description: 'You need at least one task before submitting.', type: 'error' },
  'report.submit.noProject': { title: 'Select a project', description: 'Choose a project before saving or submitting.', type: 'error' },
  'report.locked.submitted': { title: 'Awaiting review', description: 'This report has been submitted and can\u2019t be edited right now.', type: 'info' },
  'report.locked.approved': { title: 'Approved', description: 'This report is approved and locked from further edits.', type: 'info' },
  'report.needsCorrection': { title: 'Changes requested', description: 'Your manager left a comment — edit and resubmit below.', type: 'info' },

  // Review — manager
  'review.approved': { title: 'Report approved', description: 'The team member will see this update.', type: 'success' },
  'review.approveError': { title: 'Couldn\u2019t approve', description: 'Something went wrong. Try again.', type: 'error' },
  'review.changesRequested': { title: 'Changes requested', description: 'The team member has been notified.', type: 'success' },
  'review.changesError': { title: 'Couldn\u2019t submit review', description: 'Something went wrong. Try again.', type: 'error' },
  'review.commentRequired': { title: 'Comment required', description: 'Add a comment explaining what needs to change.', type: 'error' },
  'review.conflict': { title: 'Just updated', description: 'Someone else already reviewed this report. Refresh to see the latest.', type: 'error' },

  // Users — admin
  'user.invited': { title: 'User invited', description: 'They can now log in with the password you set.', type: 'success' },
  'user.inviteError': { title: 'Couldn\u2019t invite user', description: 'Check the details and try again.', type: 'error' },
  'user.deactivated': { title: 'User deactivated', description: 'They can no longer log in.', type: 'success' },
  'user.reactivated': { title: 'User reactivated', description: 'They can log in again.', type: 'success' },
  'user.toggleError': { title: 'Couldn\u2019t update user', description: 'Something went wrong. Try again.', type: 'error' },

  // Projects — admin
  'project.created': { title: 'Project added', type: 'success' },
  'project.updated': { title: 'Project updated', type: 'success' },
  'project.deactivated': { title: 'Project deactivated', description: 'Existing reports keep their history.', type: 'success' },
  'project.error': { title: 'Couldn\u2019t save project', description: 'Check the details and try again.', type: 'error' },
} satisfies Record<string, MessageEntry>;

export type MessageKey = keyof typeof MESSAGES;