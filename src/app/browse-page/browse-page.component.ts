import { Component } from '@angular/core';
import { HeaderComponent } from '../shared/components/header/header.component';
import { FooterComponent } from '../shared/components/footer/footer.component';
import { BillboardComponent } from './billboard/billboard.component';
import { CategoryRowComponent } from './category-row/category-row.component';
import { ContentService } from '../services/content/content.service';
import { VideoDetailComponent } from './video-detail/video-detail.component';
import { BreakpointService } from '../services/breakpoint/breakpoint.service';
import { LoaderService } from '../services/loader/loader.service';

@Component({
  selector: 'app-browse-page',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    BillboardComponent,
    CategoryRowComponent,
    VideoDetailComponent,
  ],
  templateUrl: './browse-page.component.html',
  styleUrl: './browse-page.component.scss'
})
export class BrowsePageComponent {
  genres: { id: number; name: string }[] = [];
  isMobile: boolean = false;

  constructor(
    private contentService: ContentService,
    private breakpointService: BreakpointService,
    private loaderService: LoaderService,
  ) {}

  /**
   * Angular lifecycle hook that runs after the component is initialized.
   * Loads the genres and subscribes to screen size changes.
   */
  ngOnInit() {
    this.loadGenres();
    this.breakpointService.isMobile().subscribe((result) => {
      this.isMobile = result.matches;
    });
  }

  /**
   * Loads genres from the content service and updates the `genres` property.
   * Logs the retrieved genres to the console.
   *
   * @async
   * @returns {Promise<void>}
   */
  async loadGenres(): Promise<void> {
    try {
      this.loaderService.start();
      const response: any = await this.contentService.getGenres();
      
      const genresWithVideos = [];
  
      // Direkt aus der Antwort die Genres mit Videos filtern
      for (const genre of response) {
        // Wenn das `videos`-Array nicht leer ist, Genre zur Liste hinzufügen
        if (genre.videos && genre.videos.length > 0) {
          genresWithVideos.push(genre);
        } else {
          // console.log(`Kein Video für Genre ${genre.name}`);
        }
      }
  
      // Nur Genres mit Videos werden angezeigt
      this.genres = genresWithVideos;
      
    } catch (error) {
      console.error(error);
    } finally {
      this.loaderService.stop();
    }
  }
}