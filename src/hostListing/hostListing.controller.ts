import { Controller, Post, Get, Put, Delete, Param, Body, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { HostListingsService } from './hostListing.service';
import { JwtAuthGuard } from '../jwt-auth.guard'; // Assuming you have an auth guard
import { multerConfig } from '../multer.config';
import { FileFieldsInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { CreateListingWithImagesDto } from './dto/createListingImages.dto';
import { CreateListingDto } from './dto/createListing.dto';
import { UpdateListingDto } from './dto/updateListing.dto';


@Controller('air-bnb/hosting')
@UseGuards(JwtAuthGuard)
export class HostListingsController {
  constructor(private readonly hostListingsService: HostListingsService) { }

  @Post('add-listing')
  async addListing(@Req() req: any, @Body() createListingDto: CreateListingDto) {
    const userId = req.user.id;
    return await this.hostListingsService.addListing(createListingDto, userId);
  }

  // @Post('add-listing-with-images')  
  // @UseInterceptors(FilesInterceptor('placeImage', 5, multerConfig))

  @Post('add-listing-with-images')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'placeImage', maxCount: 1 },
        { name: 'coverImage', maxCount: 1 },
        { name: 'additionalImages', maxCount: 5 },
      ],
      multerConfig,
    ),
  )
  async addListingWithImages(@Req() req: any, @Body() createListingDto: CreateListingWithImagesDto) {
    const userId = req.user.id;
    // Handle image paths
    const files = req.files;
    const images = {
      placePicture: `${process.env.SERVER_URL}listing-images/${files['placeImage'][0].filename}`,
      coverPicture: `${process.env.SERVER_URL}listing-images/${files['coverImage'][0].filename}`,
      additionalPictures: files['additionalImages'].map((file) => `${process.env.SERVER_URL}listing-images/${file.filename}`),
    };

    /*const images = {
      placePicture: req.files['placeImage'][0].path,
      coverPicture: req.files['coverImage'][0].path,
      additionalPictures: req.files['additionalImages'].map(file => file.path),
    };*/
    const updatedDto = { ...createListingDto, images };
    return await this.hostListingsService.addListing(updatedDto, userId);
  }

  @Get('hosted-listings')
  async getHostedListings(@Req() req: any) {
    const userId = req.user.id;
    return await this.hostListingsService.getHostedListings(userId);
  }

  @Put('update-listing/:id')
  async updateListing(@Param('id') id: string, @Body() updateData: UpdateListingDto) {
    return await this.hostListingsService.updateListing(id, updateData);
  }

  @Delete('delete-listing/:listingId')
  async deleteListing(@Param('listingId') listingId: string, @Req() req: any) {
    const userId = req.user.id;
    return await this.hostListingsService.deleteListing(listingId, userId);
  }
}
