'use client'
import React, { useEffect, useState } from "react";
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { Typography, Grid, Chip, Divider, Stack, Card, CardActionArea, CardMedia, CardContent, Grow, Dialog, DialogTitle, DialogActions, DialogContent, TextField, InputAdornment, Button } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { PriceChange } from '@mui/icons-material';
import PrimarySearchAppBar from "../appbar";

type Book = {
  bookid: number;
  name: string;
  condition: string;
  price: number;
  shippinglocation: string;
  picturepath: string;
};

function ReadItAgain() {
  const searchParams = useSearchParams();
  const search = searchParams.get('name');
  const params = new URLSearchParams(searchParams)
  const [books, setBooks] = useState<Book[]>([]);
  const [animation, setAnimation] = useState(false);
  const [open, setOpen] = useState(false);
  const [pricefilter, setPricefilter] = useState(false);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedChip, setSelectedChip] = useState('default');
  const handleChipClick = (chip: string) => {
    setSelectedChip(chip);
    if (chip === 'default') {
      setSortBy(null);
    } else {
      setSortBy(chip);
    }
    setTimeout(() => setAnimation(false), 200);
    setTimeout(() => setAnimation(true), 400);
  };
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleDelete = () => {
    setMinPrice('');
    setMaxPrice('');
  };
  useEffect(() => {
    if (sortBy) params.set('sort_by', sortBy);
    if (minPrice) params.set('min_price', minPrice.toString());
    if (maxPrice) params.set('max_price', maxPrice.toString());
    if (minPrice || maxPrice) {
      setPricefilter(true);
    }
    else {
      setPricefilter(false);
    }
    fetch(`/api/py/books?${params.toString()}`)
      .then((response) => response.json())
      .then((data) => {
        setBooks(data);
        setAnimation(true);
      })
      .catch((error) => {
        console.error('Error fetching books:', error);
      });
  }, [search, sortBy, minPrice, maxPrice]);
  return (
    <main className="overflow-x-hidden min-h-screen bg-white flex flex-col">
      <PrimarySearchAppBar></PrimarySearchAppBar>
      <Grid container spacing={2} className="px-24 mt-4">
        {/* 標題和篩選chip */}
        <Grid item xs={12} container justifyContent="space-between" alignItems="center">
          <Typography variant="h4">{search}</Typography>
          <Stack direction="row" spacing={1}>
            <Chip label="Default"
              color={selectedChip === 'default' ? 'primary' : 'default'}
              variant={selectedChip === 'default' ? undefined : 'outlined'}
              onClick={() => handleChipClick('default')} />
            <Chip icon={<ArrowUpwardIcon />} label="Price"
              color={selectedChip === 'price_ascending' ? 'primary' : 'default'}
              variant={selectedChip === 'price_ascending' ? undefined : 'outlined'}
              onClick={() => handleChipClick('price_ascending')} />
            <Chip icon={<ArrowDownwardIcon />} label="Price"
              color={selectedChip === 'price_descending' ? 'primary' : 'default'}
              variant={selectedChip === 'price_descending' ? undefined : 'outlined'}
              onClick={() => handleChipClick('price_descending')} />
            <Chip label="Price Range" color="primary" variant={pricefilter ? undefined : 'outlined'} onClick={handleClickOpen} onDelete={pricefilter ? handleDelete : undefined} />
          </Stack>
        </Grid>

        {/* 分割線 */}
        <Grid item xs={12}>
          <Divider />
        </Grid>

        {/* 書本卡片列表 */}
        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }} item>
          {books.map((book, index) => (
            <Grid item xs={4} sm={4} md={3} key={index}>
              <Grow in={animation}>
                <Card>
                  <CardActionArea
                  href={"/Book/"+book.bookid}>
                    <CardMedia
                      component="img"
                      image={"/api/py/img/book/" + book.picturepath}
                      className="h-60"
                      alt="Book Picture"
                    />
                    <CardContent className="bg-tan-50">
                      <Typography gutterBottom variant="h5" className="font-bold" component="div">
                        {book.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {book.condition} ‧ {book.shippinglocation}
                      </Typography>
                      <Typography variant="body1" className="text-amber-900">
                        ${book.price}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grow>
            </Grid>
          ))}
        </Grid>
        {/*價格範圍彈窗*/}
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle><PriceChange fontSize="large"></PriceChange> Price Range</DialogTitle>
          <DialogContent>
            <Stack direction={{ xs: 'column', sm: 'row' }}
              className="pt-2"
              spacing={1}>
              <TextField
                value={minPrice}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setMinPrice(event.target.value);
                }}
                label="Minimum"
                type="number"
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                variant="outlined"
                margin="normal"
              />
              <Typography
                className="text-center self-center font-bold"
              >~</Typography>
              <TextField
                value={maxPrice}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setMaxPrice(event.target.value);
                }}
                label="Maximum"
                type="number"
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                variant="outlined"
                margin="normal"
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary" variant="contained">
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>

    </main>
  );
}


export default ReadItAgain;