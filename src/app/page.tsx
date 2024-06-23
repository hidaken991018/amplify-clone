'use client';
import { Authenticator, TextField } from '@aws-amplify/ui-react';
import { Hub } from 'aws-amplify/utils';
import '@aws-amplify/ui-react/styles.css';
import { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Grid, Card, CardContent, CardMedia, Box } from '@mui/material';

import { Amplify } from 'aws-amplify';
import config from '@/amplifyconfiguration.json';
Amplify.configure(config);
import { get, post } from 'aws-amplify/api';
import useSWR, { Fetcher } from 'swr';
import { AuthUser } from 'aws-amplify/auth';
import { list, uploadData } from 'aws-amplify/storage';

type Post = {
  id: string;
  username: string;
  imageUrl: string;
  caption: string;
  timestamp: string;
};


const fetchPosts = async (): Promise<Post[] | any> => {
  try {
    const data = get({
      apiName: 'apiddfc4c6e',
      path: '/posts'
    });
    const { body } = await data.response;
    const response = await body.json();
    return response;
  } catch (error) {
    console.error('Error fetching posts:', error);
    return []
  }
};


export default function HomePage() {

  const { data: posts, error, mutate } = useSWR<Post[], Error>('/posts', fetchPosts);
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState<string>('');

  Hub.listen('auth', ({ payload }) => {
    switch (payload.event) {
      case 'signedIn':
        mutate(posts)
        break;
    }
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async (user: AuthUser | undefined) => {
    console.log("handleUpload")
    if (file) {
      const filename = `${Date.now()}_${file.name}`;
      console.log("file")
      try {
        console.log("uploadData")
        const result = await uploadData({
          path: "album/2024/1.jpg",
          // Alternatively, path: ({identityId}) => `album/${identityId}/1.jpg`
          data: file,
          // options: {
          //   onProgress: ({ transferredBytes, totalBytes }) => {
          //     if (totalBytes) {
          //       console.log(
          //         `Upload progress ${Math.round(
          //           (transferredBytes / totalBytes) * 100
          //         )} %`
          //       );
          //     }
          //   },
          // },
        }).result;

        let image;
        try {
          image = await list({
            path: "album/2024/1.jpg",
            // Alternatively, path: ({identityId}) => `album/{identityId}/photos/`
          });
        } catch (error) {
          console.log(error);
        }

        const newPost = {
          id: `${Date.now()}`,
          username: user?.username,
          image: "",
          caption,
          timestamp: new Date().toISOString(),
        };
        await post({
          apiName: 'apiddfc4c6e',
          path: '/posts'
        });
        alert('File uploaded and post created successfully!');
        setFile(null);
        setCaption('');
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    };
  }

  if (error) return <div>Failed to load</div>;
  if (!posts) return <div>読み込み中...</div>;

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <div>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Welcome {user?.username}
              </Typography>
              <Button color="inherit" onClick={signOut}>Sign out</Button>
            </Toolbar>
          </AppBar>
          <Container sx={{ mt: 4 }}>
            <Box mb={4}>
              <Typography variant="h6">Upload a new photo</Typography>
              <input type="file" onChange={handleFileChange} />
              <TextField
                label="Caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                margin="normal"
              />
              <Button variant="contained" color="primary" onClick={() => handleUpload(user)}>
                Upload
              </Button>
            </Box>
            <Grid container spacing={4}>
              {posts.map((post: Post) => (
                <Grid item key={post.id} xs={12} sm={6} md={4}>
                  <Card>
                    <CardMedia
                      component="img"
                      height="140"
                      image={post.imageUrl}
                      alt={post.caption}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {post.username}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {post.caption}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(post.timestamp).toLocaleString()}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </div>
      )}
    </Authenticator>
  );
}
