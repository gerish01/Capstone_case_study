from django.contrib.auth.models import User
from django.db import models


class Project(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    start_date = models.DateField()
    end_date = models.DateField()
    owner = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.name


class Task(models.Model):
    STATUS_CHOICES = [
        ("new", "New"),
        ("in-progress", "In Progress"),
        ("blocked", "Blocked"),
        ("completed", "Completed"),
        ("not started", "Not Started"),
    ]
    description = models.TextField()
    due_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.description} ({self.status})"


class UserRole(models.Model):
    ROLE_CHOICES = [
        ("admin", "Admin"),
        ("task_creator", "Task Creator"),
        ("read_only", "Read Only"),
    ]
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=50, choices=ROLE_CHOICES)

    def __str__(self):
        return f"{self.user.username} - {self.role}"
