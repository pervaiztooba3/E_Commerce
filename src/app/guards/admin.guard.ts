import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const notification = inject(NotificationService);

  if (authService.isLoggedIn() && authService.isAdmin()) {
    return true;
  }

  notification.error('Access restricted. Admin credentials required.', 'Access Denied');
  router.navigate(['/login']);
  return false;
};
