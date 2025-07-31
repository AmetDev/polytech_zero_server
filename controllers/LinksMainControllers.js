import Content from '../models/LinksMain.js'

// Get content /api/content
export const findOneLinkMain = async (req, res) => {
  try {
    const content = await Content.findOne();
    if (!content) return res.status(404).json({ error: 'Content not found' });
    res.json(content);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch content' });
  }
}

// Update entire content /api/content
export const updateLinkById = async (req, res) => {
  try {
    const { id } = req.query;
    const { text, href, isList } = req.body;
    console.log(id);

    // Validate that at least one field is provided for update
    if (!text && !href && isList === undefined) {
      return res.status(400).json({
        success: false,
        message: 'At least one field (text, href, or isList) must be provided'
      });
    }

    const content = await Content.findOne();
    
    if (!content) {
      return res.status(404).json({ 
        success: false,
        message: 'Content not found' 
      });
    }

    // Find the link by its ObjectId
    const linkIndex = content.links.findIndex(link => link._id.toString() === id);
    
    if (linkIndex === -1) {
      return res.status(404).json({ 
        success: false,
        message: 'Link with provided ID not found' 
      });
    }

    // Update only the provided fields, preserving subLinks
    const updatedLink = {
      ...content.links[linkIndex].toObject(),
      ...(text !== undefined && { text }),
      ...(href !== undefined && { href }),
      ...(isList !== undefined && { isList: !!isList })
    };

    // If isList is being set to false, ensure subLinks is cleared
    if (isList === false) {
      updatedLink.subLinks = [];
    }

    // Update the link in the array
    content.links[linkIndex] = updatedLink;
    await content.save();
    
    res.json({ 
      success: true,
      message: 'Link updated successfully', 
      data: content 
    });
  } catch (error) {
    console.error('Error updating link:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to update link',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// Add new link /api/links
export const AddNewLink = async (req, res) => {
  try {
    const { text, href, isList, subLinks } = req.body;
    if (!text || !href) return res.status(400).json({ error: 'Text and href are required' });
    const content = await Content.findOne();
    console.log(content)
    content.links.push({ text, href, isList: !!isList, subLinks: subLinks || [] });
    await content.save();
    res.json({ message: 'Link added successfully', content });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Failed to add link' });
  }
}

// Delete link /api/links/:index
export const deleteLinkById = async (req, res) => {
  try {
    const { id } = req.query;
    const content = await Content.findOne();
    
    if (!content) {
      return res.status(404).json({ 
        success: false, 
        message: 'Content not found' 
      });
    }

    // Find the index of the link with the specified ObjectId
    const linkIndex = content.links.findIndex(link => link._id.toString() === id);
    
    if (linkIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        message: 'Link with provided ID not found' 
      });
    }

    // Remove the link
    content.links.splice(linkIndex, 1);
    await content.save();
    
    res.json({ 
      success: true,
      message: 'Link deleted successfully', 
      data: content 
    });
  } catch (error) {
    console.error('Error deleting link:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to delete link',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
// Add new sub-link api/links/:index/sublinks
export const addSubLink = async (req, res) => {
  try {
    const { linkId } = req.query;
    const { text, href } = req.body;
    
    if (!text || !href) {
      return res.status(400).json({ 
        success: false,
        message: 'Text and href are required' 
      });
    }
    
    const content = await Content.findOne();
    
    if (!content) {
      return res.status(404).json({ 
        success: false,
        message: 'Content not found' 
      });
    }

    // Find the parent link by its ObjectId
    const linkIndex = content.links.findIndex(link => link._id.toString() === linkId);
    
    if (linkIndex === -1 || !content.links[linkIndex].isList) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid link ID or link is not a list' 
      });
    }

    // Add the new sub-link
    content.links[linkIndex].subLinks.push({ text, href });
    await content.save();
    
    res.json({ 
      success: true,
      message: 'Sub-link added successfully', 
      data: content 
    });
  } catch (error) {
    console.error('Error adding sub-link:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to add sub-link',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
// Delete sub-link /api/links/:index/sublinks/:subIndex
export const deleteSubLink = async (req, res) => {
  try {
    const { linkId, subLinkId } = req.query;
    const content = await Content.findOne();
    
    if (!content) {
      return res.status(404).json({ 
        success: false,
        message: 'Content not found' 
      });
    }

    // Find the parent link by its ObjectId
    const linkIndex = content.links.findIndex(link => link._id.toString() === linkId);
    
    if (linkIndex === -1 || !content.links[linkIndex].isList) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid link ID or link is not a list' 
      });
    }

    // Find the sub-link by its ObjectId
    const subLinkIndex = content.links[linkIndex].subLinks.findIndex(subLink => subLink._id.toString() === subLinkId);
    
    if (subLinkIndex === -1) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid sub-link ID' 
      });
    }

    // Remove the sub-link
    content.links[linkIndex].subLinks.splice(subLinkIndex, 1);
    await content.save();
    
    res.json({ 
      success: true,
      message: 'Sub-link deleted successfully', 
      data: content 
    });
  } catch (error) {
    console.error('Error deleting sub-link:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to delete sub-link',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

export const updateSubLink = async (req, res) => {
  try {
    const { linkId, subLinkId } = req.query;
    const { text, href } = req.body;

    if (!text || !href) {
      return res.status(400).json({ 
        success: false,
        message: 'Text and href are required' 
      });
    }

    const content = await Content.findOne();
    
    if (!content) {
      return res.status(404).json({ 
        success: false,
        message: 'Content not found' 
      });
    }

    // Find the parent link by its ObjectId
    const linkIndex = content.links.findIndex(link => link._id.toString() === linkId);
    
    if (linkIndex === -1 || !content.links[linkIndex].isList) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid link ID or link is not a list' 
      });
    }

    // Find the sub-link by its ObjectId
    const subLinkIndex = content.links[linkIndex].subLinks.findIndex(subLink => subLink._id.toString() === subLinkId);
    
    if (subLinkIndex === -1) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid sub-link ID' 
      });
    }

    // Update the sub-link
    content.links[linkIndex].subLinks[subLinkIndex] = { 
      ...content.links[linkIndex].subLinks[subLinkIndex].toObject(),
      text, 
      href 
    };
    await content.save();
    
    res.json({ 
      success: true,
      message: 'Sub-link updated successfully', 
      data: content 
    });
  } catch (error) {
    console.error('Error updating sub-link:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to update sub-link',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}