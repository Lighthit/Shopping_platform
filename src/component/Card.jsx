import { useEffect } from 'react';
import { styled } from '@mui/joy/styles';
import Sheet from '@mui/joy/Sheet';
import AspectRatio from '@mui/joy/AspectRatio';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import IconButton from '@mui/joy/IconButton';
import Typography from '@mui/joy/Typography';
import BookmarkAdd from '@mui/icons-material/BookmarkAddOutlined';

export default function Cards_Ja({img, NameTag , Prices, onAddToCart }){
    return (
        <Card sx={{ width: 240 }}>
          <div>
            <Typography level="title-lg">{NameTag}</Typography>
          </div>
          <AspectRatio minHeight="60px" maxHeight="120px">
            <img
              src={img}
              loading="lazy"
              alt=""
            />
          </AspectRatio>
          <CardContent orientation="horizontal">
            <div>
              <Typography level="body-xs">Price:</Typography>
              <Typography sx={{ fontSize: 'lg', fontWeight: 'lg' }}>{Prices} THB</Typography>
            </div>
            <Button
              variant="solid"
              size="md"
              color="primary"
              aria-label="Explore Bahamas Islands"
              onClick={() => onAddToCart(NameTag, Prices)}
              sx={{ ml: 'auto', alignSelf: 'center', fontWeight: 600 }}
            >
              Add to Cart
            </Button>
          </CardContent>
        </Card>
      );
}