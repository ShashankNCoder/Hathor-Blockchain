import fs from 'fs';
import path from 'path';

const filePath = path.join(__dirname, '../../data/users.json');

function loadUsers() {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '[]');
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

export function getUserByTelegramId(telegramId: string | number) {
  const users = loadUsers();
  // Convert both to string for comparison
  const searchId = String(telegramId);
  return users.find((u: any) => String(u.telegramId) === searchId);
}

export function saveUser(user: any) {
  const users = loadUsers();
  const index = users.findIndex((u: any) => String(u.telegramId) === String(user.telegramId));
  
  // Ensure we preserve the seed if it exists
  if (index >= 0 && users[index].seed && !user.seed) {
    user.seed = users[index].seed;
  }
  
  if (index >= 0) users[index] = user;
  else users.push(user);
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
}
