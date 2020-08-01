import React from "react";
import { Box, Typography } from "@material-ui/core";
import { BeatLoader } from "react-spinners";

export interface ILoader {
  message: string
}

const Loader = ({ message }: ILoader) => 
  <Box
    position="absolute"
    style={{
      backgroundColor: "rgba(0, 0, 0, 0.7)"
    }}
    top={0}
    left={0}
    color="#FFFFFF"
    width="100vw"
    height="100vh"
    zIndex={10000}>
    
    <Box
      display="flex"
      flexDirection="column"
      height="100%"
      justifyContent="center"
      alignItems="center">
      <Typography style={{ marginBottom: 64 }} variant="h3" component="p">{message}</Typography>
      <BeatLoader size={50} color="#FFFFFF"/>
    </Box>
  </Box>

export default Loader;