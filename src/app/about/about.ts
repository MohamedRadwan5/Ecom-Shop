import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface TeamMember {
  name: string;
  role: string;
  photo: string;
}
@Component({
  imports: [CommonModule],
  selector: 'app-about',
  styleUrl: './about.css',
  templateUrl: './about.html',
})
export class About {

  heroImage: string ='https://wallpaperaccess.com/full/6437054.jpg';

  storyParagraphs: string[] = [
    `Our journey began with a simple idea: give every customer an easy, reliable shopping experience.
     Since day one, we've focused on sourcing quality products and building a passionate team that puts
     customer satisfaction first, constantly refining our services to keep up with a changing market.`,
    `Over the years we've grown to serve thousands of customers, while staying true to the values we
     started with: transparency, quality, and reliability. We believe real success is measured by the
     satisfaction of the people we serve.`
  ];

  missionVisionParagraphs: string[] = [
    `Our mission is to simplify online shopping by offering carefully curated products and outstanding
     customer service, backed by the highest standards of quality and transparency in every interaction.`,
    `Our vision is to become the leading destination for online shopping in the region, driven by
     continuous innovation and long-term relationships built on trust with our customers and partners.`
  ];

  team: TeamMember[] = [
    {
      name: 'John Doe',
      role: 'Executive Manager',
      photo: 'https://tse1.mm.bing.net/th/id/OIP.2O1VUc1nYvHTWTkMie5PkAAAAA?r=0&pid=ImgDet&w=184&h=276&c=7&dpr=1.3&o=7&rm=3'
    },
    {
      name: 'Jane Smith',
      role: 'Development Manager',
      photo: 'https://as2.ftcdn.net/jpg/10/76/17/35/1000_F_1076173580_t0OeEmmT8f0iLVFx0xMqPozTm8IDmp9W.jpg'
    },
    {
      name: 'Michael Johnson',
      role: 'Sales Manager',
      photo: 'https://files.idyllic.app/files/static/3972779'
    },
    {
      name: 'David Denial',
      role: 'Sales Manager',
      photo: 'https://i.pinimg.com/736x/c4/b0/37/c4b03714f8813cce24c1f6e7b76fde9f.jpg'
    },
    {
      name: 'Andro Smith',
      role: 'Sales Manager',
      photo: 'https://themaleedit.com/wp-content/uploads/2025/06/1B7Zk0KDmUxxHycNSrSsP.webp'
    },
    {
      name: 'Sarah Lee',
      role: 'Operation Manager',
      photo: 'https://png.pngtree.com/png-vector/20231117/ourlarge/pngtree-cute-girl-bigness-white-background-png-image_10629306.png'
    }
  ];

  features: { icon: string; label: string }[] = [
    { icon: '🚚', label: 'Fast & Free Delivery' },
    { icon: '🔒', label: 'Secure Payments' },
    { icon: '🎧', label: '24/7 Support' }
  ];
}