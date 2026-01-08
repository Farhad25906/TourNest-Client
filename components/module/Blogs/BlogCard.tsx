import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, MessageCircle, Heart, MoreVertical, Calendar, User } from "lucide-react"
import { IBlog } from "@/services/blog.service"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface BlogCardProps {
  blog: IBlog
  onEdit: (blog: IBlog) => void
  onDelete: (blogId: string, blogTitle: string) => void
}

export function BlogCard({ blog, onEdit, onDelete }: BlogCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED': return 'bg-green-500'
      case 'DRAFT': return 'bg-yellow-500'
      default: return 'bg-gray-500'
    }
  }

  const formatCategory = (category: string) => {
    return category.toLowerCase().replace(/_/g, ' ')
  }

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge className={`${getStatusColor(blog.status)} hover:${getStatusColor(blog.status)}`}>
                {blog.status}
              </Badge>
              <Badge variant="outline" className="capitalize">
                {formatCategory(blog.category)}
              </Badge>
            </div>
            <CardTitle className="line-clamp-2 mb-2">{blog.title}</CardTitle>
            {blog.excerpt && (
              <CardDescription className="line-clamp-2">
                {blog.excerpt}
              </CardDescription>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(blog)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-destructive"
                onClick={() => onDelete(blog.id, blog.title)}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      {blog.coverImage && (
        <div className="px-6 pt-2">
          <div className="relative h-48 rounded-lg overflow-hidden">
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="object-cover w-full h-full"
            />
          </div>
        </div>
      )}
      
      <CardContent className="flex-1 pt-4">
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <span>{blog.host?.name || 'Unknown'}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(blog.createdAt)}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="border-t pt-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{blog.views}</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{blog.likesCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{blog._count?.comments || 0}</span>
            </div>
          </div>
          <Button variant="outline" size="sm" asChild>
            <a href={`/blogs/${blog.id}`} target="_blank">
              View
            </a>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}