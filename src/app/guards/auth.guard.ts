import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const notification = inject(NotificationService);

  if (authService.isLoggedIn()) {
    return true;
  }

  notification.warning('Please log in to access this page.', 'Authentication Required');
  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};
