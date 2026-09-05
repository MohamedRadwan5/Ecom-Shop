import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../shared/navbar/navbar';
import { FooterComponent } from '../shared/footer/footer';

interface TeamMember {
  name: string;
  role: string;
  photo: string;
  borderColor: string;
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent],
  templateUrl: './about.html',
  styleUrl: './about.css'
})
export class AboutComponent {
  heroImage = 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80';

  storyParagraphs: string[] = [
    `Our journey began with a simple idea: give every customer an easy, reliable shopping experience with authentic top-grade merchandise. Since day one, we've focused on sourcing quality products and building a passionate team that puts customer satisfaction first, constantly refining our services to keep up with an evolving digital market.`,
    `Over the years we've grown to serve hundreds of thousands of satisfied customers across the region, while staying true to the fundamental values we started with: transparency, craftsmanship, high security, and unwavering reliability. We believe real success is measured by the satisfaction of the people we serve.`
  ];

  missionVisionParagraphs: string[] = [
    `Our mission is to simplify online commerce by offering carefully curated global products, transparent pricing, and outstanding round-the-clock customer service, backed by the highest standards of quality in every interaction.`,
    `Our vision is to become the leading and most trusted online destination in the Middle East and worldwide, driven by continuous innovation, cutting-edge logistics, and enduring partnerships built on customer trust.`
  ];

  team: TeamMember[] = [
    {
      name: 'Danial Ramirez',
      role: 'Executive Director',
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      borderColor: '#3b82f6'
    },
    {
      name: 'Sarah Mitchell',
      role: 'Head of Operations',
      photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
      borderColor: '#06b6d4'
    },
    {
      name: 'Elena Rostova',
      role: 'Chief Design Officer',
      photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
      borderColor: '#ec4899'
    },
    {
      name: 'Marcus Vance',
      role: 'Lead Tech Architect',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      borderColor: '#ef4444'
    },
    {
      name: 'Amir Salama',
      role: 'Product Strategy Lead',
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
      borderColor: '#3b82f6'
    },
    {
      name: 'Fatima El-Sayed',
      role: 'Customer Experience Head',
      photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
      borderColor: '#10b981'
    }
  ];
}