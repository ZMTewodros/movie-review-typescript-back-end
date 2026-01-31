import { Controller, Get } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin') // The base path
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats') // The sub-path -> result: /admin/stats
  async getDashboardStats() {
    return this.adminService.getStats();
  }
}